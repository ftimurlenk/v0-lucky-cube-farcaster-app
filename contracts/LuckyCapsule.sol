// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

/**
 * @title LuckyCapsule
 * @dev Manipüle edilemez kapsül açma sistemi - Chainlink VRF ile gerçek randomness
 */
contract LuckyCapsule is VRFConsumerBaseV2, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Chainlink VRF parametreleri
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // Kapsül açma ücreti
    uint256 public capsuleFee = 0.001 ether;

    // Token havuzu
    struct TokenReward {
        address tokenAddress;
        uint256 minAmount;
        uint256 maxAmount;
        uint8 rarity; // 0: Common, 1: Rare, 2: Epic, 3: Legendary
        bool isActive;
    }

    TokenReward[] public rewardTokens;
    
    // Kullanıcı limitleri (günlük spam önleme)
    mapping(address => uint256) public lastCapsuleTime;
    uint256 public constant COOLDOWN_PERIOD = 1 days;

    // VRF request mapping
    mapping(uint256 => address) public requestIdToUser;
    
    // Events
    event CapsuleRequested(address indexed user, uint256 indexed requestId);
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

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
    }

    /**
     * @dev Kapsül açma isteği - Chainlink VRF ile randomness talebi
     */
    function openCapsule() external payable nonReentrant returns (uint256 requestId) {
        require(msg.value >= capsuleFee, "Insufficient fee");
        require(block.timestamp >= lastCapsuleTime[msg.sender] + COOLDOWN_PERIOD, "Cooldown active");
        require(rewardTokens.length > 0, "No rewards available");

        // Chainlink VRF randomness talebi
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        requestIdToUser[requestId] = msg.sender;
        lastCapsuleTime[msg.sender] = block.timestamp;

        emit CapsuleRequested(msg.sender, requestId);
        
        return requestId;
    }

    /**
     * @dev Chainlink VRF callback - Gerçek random sonuç alındığında çağrılır
     * @notice Bu fonksiyon sadece Chainlink VRF Coordinator tarafından çağrılabilir
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address user = requestIdToUser[requestId];
        require(user != address(0), "Invalid request");

        // Random sayıyı kullanarak ödül seç
        uint256 randomValue = randomWords[0];
        (address tokenAddress, uint256 amount, uint8 rarity) = _selectReward(randomValue);

        // Token transferi
        IERC20(tokenAddress).safeTransfer(user, amount);

        emit CapsuleOpened(user, tokenAddress, amount, rarity);
        
        delete requestIdToUser[requestId];
    }

    /**
     * @dev Random değere göre ödül seçimi
     * @param randomValue Chainlink VRF'den gelen gerçek random değer
     */
    function _selectReward(uint256 randomValue) private view returns (
        address tokenAddress,
        uint256 amount,
        uint8 rarity
    ) {
        // Aktif ödülleri topla
        TokenReward[] memory activeRewards = new TokenReward[](rewardTokens.length);
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < rewardTokens.length; i++) {
            if (rewardTokens[i].isActive) {
                activeRewards[activeCount] = rewardTokens[i];
                activeCount++;
            }
        }
        
        require(activeCount > 0, "No active rewards");

        // Rarity weights: Common (50%), Rare (30%), Epic (15%), Legendary (5%)
        uint256 rarityRoll = randomValue % 100;
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

        // Seçilen rarity'ye göre token seç
        TokenReward[] memory matchingRewards = new TokenReward[](activeCount);
        uint256 matchingCount = 0;
        
        for (uint256 i = 0; i < activeCount; i++) {
            if (activeRewards[i].rarity == selectedRarity) {
                matchingRewards[matchingCount] = activeRewards[i];
                matchingCount++;
            }
        }

        // Eğer bu rarity'de token yoksa, bir alt seviyeyi dene
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

        // Random token seç
        uint256 tokenIndex = (randomValue / 100) % matchingCount;
        TokenReward memory selectedToken = matchingRewards[tokenIndex];

        // Random miktar hesapla
        uint256 amountRange = selectedToken.maxAmount - selectedToken.minAmount;
        amount = selectedToken.minAmount + ((randomValue / 10000) % amountRange);

        return (selectedToken.tokenAddress, amount, selectedToken.rarity);
    }

    /**
     * @dev Yeni token ödülü ekle (sadece owner)
     */
    function addRewardToken(
        address tokenAddress,
        uint256 minAmount,
        uint256 maxAmount,
        uint8 rarity
    ) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        require(maxAmount > minAmount, "Invalid amount range");
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

    /**
     * @dev Token ödülünü aktif/pasif yap (sadece owner)
     */
    function setRewardActive(uint256 index, bool isActive) external onlyOwner {
        require(index < rewardTokens.length, "Invalid index");
        rewardTokens[index].isActive = isActive;
        emit TokenRewardUpdated(index, isActive);
    }

    /**
     * @dev Kapsül ücretini güncelle (sadece owner)
     */
    function updateFee(uint256 newFee) external onlyOwner {
        capsuleFee = newFee;
        emit FeeUpdated(newFee);
    }

    /**
     * @dev Toplanan ücretleri çek (sadece owner)
     */
    function withdrawFees(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = to.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FeeWithdrawn(to, balance);
    }

    /**
     * @dev Token havuzunu doldur (sadece owner)
     */
    function fundRewardPool(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
    }

    /**
     * @dev Acil durum token çekme (sadece owner)
     */
    function emergencyWithdrawTokens(
        address tokenAddress,
        address to,
        uint256 amount
    ) external onlyOwner {
        IERC20(tokenAddress).safeTransfer(to, amount);
    }

    /**
     * @dev Toplam ödül sayısını döndür
     */
    function getRewardCount() external view returns (uint256) {
        return rewardTokens.length;
    }

    /**
     * @dev Kullanıcının cooldown durumunu kontrol et
     */
    function canOpenCapsule(address user) external view returns (bool) {
        return block.timestamp >= lastCapsuleTime[user] + COOLDOWN_PERIOD;
    }

    /**
     * @dev Kalan cooldown süresini döndür
     */
    function getRemainingCooldown(address user) external view returns (uint256) {
        uint256 nextAvailable = lastCapsuleTime[user] + COOLDOWN_PERIOD;
        if (block.timestamp >= nextAvailable) {
            return 0;
        }
        return nextAvailable - block.timestamp;
    }

    receive() external payable {}
}
