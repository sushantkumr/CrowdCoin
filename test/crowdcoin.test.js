const CampaignFactory = artifacts.require("./CampaignFactory");
const Campaign = artifacts.require("./Campaign");

/*var lolex = require("lolex");
var clock = lolex.install({now: Date.now()});*/

contract('Testing CrowdCoin', async (accounts) => {

	let factory;

	// To deploy a fresh contract after every new test
	beforeEach(async () => {
	    factory = await CampaignFactory.new();
	});

    it("CampaignFactory deployment", async () => {
	     assert.ok(factory.address);
  });

    it("Create a new Campaign", async () => {
    	await factory
    	.createCampaign(
    		"Laptop bags",10000000,1633212241,100000000,"Create Macbook laptop bags",
    		{
				from: accounts[0]
			});

		const deployedCampaign = await factory.deployedCampaigns(0);
		assert.equal(1633212241, deployedCampaign[1].toNumber());
  });

    it("Getting ongoing Campaigns", async () => {
    	await factory
    	.createCampaign(
    		"Laptop bags",10000000,1633212241,100000000,"Create Macbook laptop bags",
    		{
				from: accounts[0]
			});

    	await factory
    	.createCampaign(
    		"Water filtering bottles", 10000000, 1733212241, 100000000000, "Create water filtering bottles",
    		{
				from: accounts[0]
			});

		const deployedCampaigns = await factory.getOngoingCampaigns();
		assert.equal(2, deployedCampaigns.length);
  });

/*    it("Getting completed Campaigns", async () => {

		var seconds = Math.round(Date.now() / 1000);

    	await factory
    	.createCampaign(
    		"Laptop bags", 10000000, seconds + 2, 100000000000, "Create Macbook laptop bags",
    		{
				from: accounts[0]
			});

    	
		var seconds = Math.round(Date.now() / 1000);
		console.log(seconds);
		let completedCampaigns;

		setTimeout(function() {
				const completedCampaigns = await factory.getCompletedCampaigns();
			}, 5000);
		assert.notEqual('0x0000000000000000000000000000000000000000', completedCampaigns[0]);

  });*/

});