# Design Pattern Desicions

### Factory DP
Factory Design Pattern has been chosen to design the smart contract because creation and maintenance of campaigns is easier and can be isolated from the factory. The complete logic for handling the operations of the campaign can be delegated to the Object(campaign) class. Moreover Solidity allows a contract to deploy another contract hence the burden of deployment and maintenance of the Campaign can be done by the Campaign manager. The role of the factory is to only deploy and show the addresses of deployed campaigns.

### Circuit breaker/Emergency Stop
There can be instances where the need to stop operations can arise, either due to onchain or offchain issues. Whatever the reason be, there must be a switch to protect the funds or prevent the infusion of more in campaigns. Hence the need for for a Circuit breaker. This has been implemented in both the CampaignFactory and Campaign contracts to control the ETH which could flow into them.
