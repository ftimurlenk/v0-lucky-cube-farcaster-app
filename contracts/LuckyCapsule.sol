// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface ISupraRouter {
    function generateRequest(
        string memory _functionSig,
        uint8 _rngCount,
        uint256 _numConfirmations,
        address _clientWalletAddress
    ) external returns (uint256);
    
    function generateRequest(
        string memory _functionSig,
        uint8 _rngCount,
        uint256 _numConfirmations,
        uint256 _clientSeed,
        address _clientWalletAddress
    ) external returns (uint256);
}

/**
 * @title LuckyCapsule
 * @dev Manipüle edilemez kapsül açma sistemi - Supra dVRF ile gerçek randomness
 */
contract LuckyCapsule is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public immutable supraAddr;
    address public immutable supraClientAddress;

    uint256 public capsuleFee = 0.001 ether;

    struct TokenReward {
        address tokenAddress;
        uint256 minAmount;
        uint256 maxAmount;
        uint8 rarity; // 0: Common, 1: Rare, 2: Epic, 3: Legendary
        bool isActive;
    }

    TokenReward[] public rewardTokens;
    
    mapping(address => uint256) public lastCapsuleTime;
    uint256 public constant COOLDOWN_PERIOD = 1 days;

    mapping(uint256 => address) public nonceToUser;
    mapping(uint256 => uint256[]) public rngForNonce;
    
    event CapsuleRequested(address indexed user, uint256 indexed nonce);
    event CapsuleOpened(
        address indexed user,
        address indexed tokenAddress,
        uint256 amount,
        uint8 rarity
    );
    event TokenRewardAdded(address indexed token, uint256 minAmount, uint256 maxAmount, uint8 rarity);
    event TokenRewardUpdated(uint256 indexed index, bool isActive);
    event FeeUpdated(uint256 newFee);
    event FeeWithdrawn(address indexed to, uint256 amount);

    constructor(address _supraAddr, address _supraClientAddress) {
        supraAddr = _supraAddr;
        supraClientAddress = _supraClientAddress;
    }

    function openCapsule() external payable nonReentrant returns (uint256 nonce) {
        require(msg.value >= capsuleFee, "Insufficient fee");
        require(block.timestamp >= lastCapsuleTime[msg.sender] + COOLDOWN_PERIOD, "Cooldown active");
        require(rewardTokens.length > 0, "No rewards available");

        uint8 rngCount = 3;
        uint256 numConfirmations = 1;
        
        nonce = ISupraRouter(supraAddr).generateRequest(
            "requestCallback(uint256,uint256[])",
            rngCount,
            numConfirmations,
            supraClientAddress
        );

        nonceToUser[nonce] = msg.sender;
        lastCapsuleTime[msg.sender] = block.timestamp;

        emit CapsuleRequested(msg.sender, nonce);
        
        return nonce;
    }

    function requestCallback(uint256 _nonce, uint256[] memory _rngList) external {
        require(msg.sender == supraAddr, "Only Supra Router can call this");
        
        address user = nonceToUser[_nonce];
        require(user != address(0), "Invalid nonce");

        rngForNonce[_nonce] = _rngList;

        (address tokenAddress, uint256 amount, uint8 rarity) = _selectReward(_rngList);

        IERC20(tokenAddress).safeTransfer(user, amount);

        emit CapsuleOpened(user, tokenAddress, amount, rarity);
        
        delete nonceToUser[_nonce];
    }

    function _selectReward(uint256[] memory randomValues) private view returns (
        address tokenAddress,
        uint256 amount,
        uint8 rarity
    ) {
        require(randomValues.length >= 3, "Insufficient random values");
        
        TokenReward[] memory activeRewards = new TokenReward[](rewardTokens.length);
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < rewardTokens.length; i++) {
            if (rewardTokens[i].isActive) {
                activeRewards[activeCount] = rewardTokens[i];
                activeCount++;
            }
        }
        
        require(activeCount > 0, "No active rewards");

        uint256 rarityRoll = randomValues[0] % 100;
        uint8 selectedRarity;
        
        if (rarityRoll < 50) {
            selectedRarity = 0; // Common
        } else if (rarityRoll < 80) {
            selectedRarity = 1; // Rare
        } else if (rarityRoll < 95) {
            selectedRarity = 2; // Epic
        } else {
            selectedRarity = 3; // Legendary
        }

        TokenReward[] memory matchingRewards = new TokenReward[](activeCount);
        uint256 matchingCount = 0;
        
        for (uint256 i = 0; i < activeCount; i++) {
            if (activeRewards[i].rarity == selectedRarity) {
                matchingRewards[matchingCount] = activeRewards[i];
                matchingCount++;
            }
        }

        if (matchingCount == 0 && selectedRarity > 0) {
            selectedRarity--;
            for (uint256 i = 0; i < activeCount; i++) {
                if (activeRewards[i].rarity == selectedRarity) {
                    matchingRewards[matchingCount] = activeRewards[i];
                    matchingCount++;
                }
            }
        }

        require(matchingCount > 0, "No matching rewards");

        uint256 tokenIndex = randomValues[1] % matchingCount;
        TokenReward memory selectedToken = matchingRewards[tokenIndex];

        uint256 amountRange = selectedToken.maxAmount - selectedToken.minAmount;
        if (amountRange > 0) {
            amount = selectedToken.minAmount + (randomValues[2] % amountRange);
        } else {
            amount = selectedToken.minAmount;
        }

        return (selectedToken.tokenAddress, amount, selectedToken.rarity);
    }

    function addRewardToken(
        address tokenAddress,
        uint256 minAmount,
        uint256 maxAmount,
        uint8 rarity
    ) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        require(maxAmount >= minAmount, "Invalid amount range");
        require(rarity <= 3, "Invalid rarity");

        rewardTokens.push(TokenReward({
            tokenAddress: tokenAddress,
            minAmount: minAmount,
            maxAmount: maxAmount,
            rarity: rarity,
            isActive: true
        }));

        emit TokenRewardAdded(tokenAddress, minAmount, maxAmount, rarity);
    }

    function setRewardActive(uint256 index, bool isActive) external onlyOwner {
        require(index < rewardTokens.length, "Invalid index");
        rewardTokens[index].isActive = isActive;
        emit TokenRewardUpdated(index, isActive);
    }

    function updateFee(uint256 newFee) external onlyOwner {
        capsuleFee = newFee;
        emit FeeUpdated(newFee);
    }

    function withdrawFees(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = to.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FeeWithdrawn(to, balance);
    }

    function fundRewardPool(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
    }

    function emergencyWithdrawTokens(
        address tokenAddress,
        address to,
        uint256 amount
    ) external onlyOwner {
        IERC20(tokenAddress).safeTransfer(to, amount);
    }

    function getRewardCount() external view returns (uint256) {
        return rewardTokens.length;
    }

    function canOpenCapsule(address user) external view returns (bool) {
        return block.timestamp >= lastCapsuleTime[user] + COOLDOWN_PERIOD;
    }

    function getRemainingCooldown(address user) external view returns (uint256) {
        uint256 nextAvailable = lastCapsuleTime[user] + COOLDOWN_PERIOD;
        if (block.timestamp >= nextAvailable) {
            return 0;
        }
        return nextAvailable - block.timestamp;
    }

    function viewRngForNonce(uint256 nonce) external view returns (uint256[] memory) {
        return rngForNonce[nonce];
    }

    receive() external payable {}
}
