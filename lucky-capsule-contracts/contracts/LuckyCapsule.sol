// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISupraRouter {
    function generateRequest(string memory _functionSig, uint8 _rngCount, uint256 _numConfirmations, address _clientWalletAddress) external returns(uint256);
}

contract LuckyCapsule is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Supra dVRF Router address on Base Mainnet
    address public supraRouter = 0x2B2B0D3BD3D8f0E1C5e3a13E1E6E0c2e3e4D5e6f;

    // Token addresses on Base Network
    address public constant DEGEN = 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed;
    address public constant BRETT = 0x532f27101965dd16442E59d40670FaF5eBB142E4;
    address public constant TOSHI = 0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4;
    address public constant MOCHI = 0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50;
    address public constant BASEGOD = 0xD08a2917653d4E460893203471f0000826fb4034;
    address public constant SHIBA = 0x4A8d8eBb5C8e8e0e9B2e5F2c5E3E4d5E6f7A8B9C;

    // Rarity thresholds (0-9999)
    uint256 public constant COMMON_MAX = 4999;    // 50%
    uint256 public constant RARE_MAX = 7999;      // 30%
    uint256 public constant EPIC_MAX = 9499;      // 15%
    // 9500-9999 = Legendary (5%)

    // Cooldown period (24 hours)
    uint256 public constant COOLDOWN_PERIOD = 24 hours;

    // Fee to open capsule
    uint256 public capsuleFee = 0.001 ether;

    // Mapping to track user's last capsule opening time
    mapping(address => uint256) public lastOpenTime;

    // Mapping to track pending requests
    mapping(uint256 => address) public pendingRequests;

    // Events
    event CapsuleOpened(address indexed user, address indexed token, uint256 amount, string rarity, uint256 nonce);
    event CapsuleRequested(address indexed user, uint256 nonce);

    constructor() Ownable(msg.sender) {}

    // Request to open capsule
    function openCapsule() external payable nonReentrant {
        require(msg.value >= capsuleFee, "Insufficient fee");
        require(canOpenCapsule(msg.sender), "Cooldown active");

        // Update last open time
        lastOpenTime[msg.sender] = block.timestamp;

        // Request random number from Supra dVRF
        uint256 nonce = ISupraRouter(supraRouter).generateRequest(
            "fulfillRandomWords(uint256,uint256[])",
            1, // number of random numbers needed
            1, // number of confirmations
            msg.sender
        );

        pendingRequests[nonce] = msg.sender;

        emit CapsuleRequested(msg.sender, nonce);
    }

    // Callback function called by Supra Router
    function fulfillRandomWords(uint256 nonce, uint256[] calldata randomWords) external {
        require(msg.sender == supraRouter, "Only Supra Router can call this");
        address user = pendingRequests[nonce];
        require(user != address(0), "Invalid nonce");

        // Get random number (0-9999)
        uint256 randomValue = randomWords[0] % 10000;

        // Determine reward based on rarity
        (address tokenAddress, uint256 amount, string memory rarity) = determineReward(randomValue);

        // Transfer token to user
        require(
            IERC20(tokenAddress).balanceOf(address(this)) >= amount,
            "Insufficient tokens in pool"
        );
        IERC20(tokenAddress).safeTransfer(user, amount);

        // Clean up
        delete pendingRequests[nonce];

        emit CapsuleOpened(user, tokenAddress, amount, rarity, nonce);
    }

    // Determine reward based on random value
    function determineReward(uint256 randomValue) internal pure returns (address, uint256, string memory) {
        if (randomValue <= COMMON_MAX) {
            // Common: DEGEN (100-500 tokens)
            uint256 amount = 100 * 10**18 + (randomValue % 400) * 10**18;
            return (DEGEN, amount, "Common");
        } else if (randomValue <= RARE_MAX) {
            // Rare: BRETT or TOSHI
            if (randomValue % 2 == 0) {
                // BRETT (0.05-5 tokens = 50-5000 with 3 decimals)
                uint256 amount = 50 * 10**15 + (randomValue % 5000) * 10**15;
                return (BRETT, amount, "Rare");
            } else {
                // TOSHI (50-5000 tokens)
                uint256 amount = 50 * 10**18 + (randomValue % 5000) * 10**18;
                return (TOSHI, amount, "Rare");
            }
        } else if (randomValue <= EPIC_MAX) {
            // Epic: MOCHI or SHIBA
            if (randomValue % 2 == 0) {
                // MOCHI (20-2000 tokens)
                uint256 amount = 20 * 10**18 + (randomValue % 2000) * 10**18;
                return (MOCHI, amount, "Epic");
            } else {
                // SHIBA (20M-2M tokens with 18 decimals)
                uint256 amount = 2000000 * 10**18 + (randomValue % 18000000) * 10**18;
                return (SHIBA, amount, "Epic");
            }
        } else {
            // Legendary: BASEGOD (10-50 tokens)
            uint256 amount = 10 * 10**18 + (randomValue % 40) * 10**18;
            return (BASEGOD, amount, "Legendary");
        }
    }

    // Check if user can open capsule
    function canOpenCapsule(address user) public view returns (bool) {
        return block.timestamp >= lastOpenTime[user] + COOLDOWN_PERIOD;
    }

    // Get time until next capsule opening
    function timeUntilNextCapsule(address user) public view returns (uint256) {
        uint256 nextOpenTime = lastOpenTime[user] + COOLDOWN_PERIOD;
        if (block.timestamp >= nextOpenTime) {
            return 0;
        }
        return nextOpenTime - block.timestamp;
    }

    // Owner functions
    function updateSupraRouter(address _newRouter) external onlyOwner {
        supraRouter = _newRouter;
    }

    function updateCapsuleFee(uint256 _newFee) external onlyOwner {
        capsuleFee = _newFee;
    }

    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    // View function to check token balance in contract
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    receive() external payable {}
}
