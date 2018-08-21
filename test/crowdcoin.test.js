const CampaignFactory = artifacts.require("./CampaignFactory");
const Campaign = artifacts.require("./Campaign");

contract('Testing CrowdCoin', async (accounts) => {

	let factory;

	function timeout(ms) {
	    return new Promise(resolve => setTimeout(resolve, ms));
	}

	// To deploy a fresh contract after every new test
	beforeEach(async () => {
	    factory = await CampaignFactory.new();
	});

    it("CampaignFactory deployment", async () => {
	     assert.ok(factory.address);
  });

    it("Create a new Campaign", async () => {
    	let eventDetails = await factory
    	.createCampaign(
    		"Laptop bags",10000000,1633212241,100000000,"Create Macbook laptop bags",
    		{
				from: accounts[0]
			});

    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];
		let deployedCampaign = await factory.deployedCampaigns(0);
		deployedCampaign = deployedCampaign[0];
		assert.equal(addressFromEvent, deployedCampaign);
  });

    it("Get ongoing Campaigns", async () => {
    	let eventDetails = await factory
    	.createCampaign(
    		"Laptop bags",10000000,1633212241,100000000,"Create Macbook laptop bags");

    	addressFromEvent1 = eventDetails['logs'][1]['args']['campaignAddress'];

    	eventDetails = await factory
    	.createCampaign(
    		"Water filtering bottles", 10000000, 1733212241, 100000000000, "Create water filtering bottles");

    	addressFromEvent2 = eventDetails['logs'][1]['args']['campaignAddress'];

		let deployedCampaigns = await factory.getCampaigns('0x0000000000000000000000000000000000000000', 0);
		deployedCampaigns = deployedCampaigns[0];
		assert.equal(addressFromEvent1, deployedCampaigns[0]);
		assert.equal(addressFromEvent2, deployedCampaigns[1]);
  });

    it("Get completed Campaigns", async () => {

		var deadLine = Math.round(Date.now() / 1000) + 2;

    	let eventDetails = await factory
    	.createCampaign(
    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");

    	addressFromEvent1 = eventDetails['logs'][1]['args']['campaignAddress'];

		eventDetails = await factory
    	.createCampaign(
    		"Water filtering bottles", 10000000, deadLine, 100000000000, "Create water filtering bottles");

    	addressFromEvent2 = eventDetails['logs'][1]['args']['campaignAddress'];

    	// To cause some delay and lapse the deadline of the created campaigns
		await timeout(4000);

		let deployedCampaigns = await factory.getCampaigns('0x0000000000000000000000000000000000000000', 0);
		await (deployedCampaigns = deployedCampaigns[1]);
		await assert.equal(addressFromEvent1, deployedCampaigns[0]);
		await assert.equal(addressFromEvent2, deployedCampaigns[1]);
  });

    it("Contribute to a Campaign", async () => {

		var deadLine = Math.round(Date.now() / 1000) + 2;

    	let eventDetails = await factory
    	.createCampaign(
    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];

    	campaign = await Campaign.at(addressFromEvent);
    	//console.log(campaign);
    	await campaign.contribute({
    		from: accounts[0],
    		value: 10000000000000000,
    	});

    	let balance = await campaign.amountRaised.call()
    	balance = balance.toNumber();
    	assert(balance, 10000000000000000);
  });

});