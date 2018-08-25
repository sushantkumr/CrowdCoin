# Avoiding common attacks

### Reentrancy
Reentrancy attacks in Campaign contract have been prevented by importing Open Zepplin's ReentrancyGuard.sol. The modifier checks have been inserted into both contribute() and withdraw() methods.


### Ownable
Ownable has been imported into both CampaignFactory and Campaign in order to prevent accidental or intentional assignment of unauthorized ownership of the contracts. Also, few administrational responsibilities can be easily controlled by the said contrcts by making use of the modifiers available.

### Refund
Refund option has been provided to allow the option of refund the backers funds if something goes wrong offchain/onchain. This feature can be activated by the owner of the campaign after the deadline has passed.

### Emergency Stop
Circuit breaker or Emergency stop has been integrated in both CampaignFactory and Campaign to toggle the operations on the contracts which involve infusion of ETH. This feature can be activated by the owner of CampaignFactory or a particular Campaign.

### Restrict amount of ETH/campaign
Every campaign has a restriction of 10 ETH in order to limit the amount of risk.

### SafeMath
Safe math prevents overflow and underflow in mathematical operations in both CampaignFactory and Campaign.

### Pull over Push for Withdrawals
The contract has made use of Pull over Push for withdrawal in order to shift the risk associated with transferring ETH to the user.