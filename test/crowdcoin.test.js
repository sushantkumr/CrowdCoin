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

	// Basic test to check if CampaignFactory is deployed
    it("CampaignFactory deployment", async () => {
	     assert.ok(factory.address);
  });

	// To create a new Campaign and get its address
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

	// To create a new Campaign and check its manager
	it('Caller as a campaign manager', async () => {
		let eventDetails = await factory
    	.createCampaign(
    		"Laptop bags",10000000,1633212241,100000000,"Create Macbook laptop bags",
    		{
				from: accounts[0]
			});

    	addressFromEvent1 = eventDetails['logs'][1]['args']['campaignAddress'];
    	campaign = await Campaign.at(addressFromEvent);

		const manager = await campaign.manager.call();
		assert.equal(accounts[0], manager);
	});

	// To get a list of Ongoing campaigns.
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

	// To get a list of Completed campaigns. A delay method has been used to expire the deadline
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

    it("Allows people to contribute to Campaigns and marks them as contributor", async () => {
		var deadLine = Math.round(Date.now() / 1000) + 2;

    	let eventDetails = await factory
    	.createCampaign(
    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];

    	campaign = await Campaign.at(addressFromEvent);
    	await campaign.contribute({
    		from: accounts[0],
    		value: 10000000000000000,
    	});

    	let balance = await campaign.amountRaised.call()
    	balance = balance.toNumber();
    	assert(balance, 10000000000000000);
  });

	it('Camaigns require a minimum contribution', async () => {
		try {
			var deadLine = Math.round(Date.now() / 1000) + 2;

	    	let eventDetails = await factory
	    	.createCampaign(
	    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
	    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];

	    	campaign = await Campaign.at(addressFromEvent);
	    	await campaign.contribute({
	    		from: accounts[0],
	    		value: 1000000,
	    	});

	    	assert(false);
		} catch (err) {
				assert(err);
		}
	});

	it('Allows a manager to create a payment request', async () => {
		var deadLine = Math.round(Date.now() / 1000) + 2;

    	let eventDetails = await factory
    	.createCampaign(
    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];

    	campaign = await Campaign.at(addressFromEvent);
    	await campaign.contribute({
    		from: accounts[0],
    		value: 100000000000000000,
    	});

		await timeout(4000);

    	await campaign.createRequest('Buy batteries', '10000000000', accounts[1]);
		const request = await campaign.requests(0);
		assert.equal('Buy batteries', request[0]);
	});

	it('Processes requests', async () => {
		var deadLine = Math.round(Date.now() / 1000) + 2;

		let eventDetails = await factory.createCampaign(
	    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];

    	campaign = await Campaign.at(addressFromEvent);
    	await campaign.contribute({
    		from: accounts[0],
    		value: web3.toWei('10', 'ether',)
    	});

		await timeout(4000);

    	await campaign.createRequest('Buy batteries', web3.toWei('5', 'ether'), accounts[1]);
		const request = await campaign.requests(0);
		await campaign.approveRequest(0);
		await campaign.finalizeRequest(0);

		let balance = await web3.eth.getBalance(accounts[1]);
		balance = web3.fromWei(balance, 'ether');
		balance = parseFloat(balance); 
		assert(balance > 104);

	});

	it('Withdrawal from a Campaign is allowed', async () => {
    	let initialBalance = await web3.eth.getBalance(accounts[0]);
		initialBalance = web3.fromWei(initialBalance, 'ether');
		initialBalance = parseFloat(initialBalance);

		var deadLine = Math.round(Date.now() / 1000) + 2;
		let eventDetails = await factory.createCampaign(
	    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];
    	campaign = await Campaign.at(addressFromEvent);
    	await campaign.contribute({
    		from: accounts[0],
    		value: web3.toWei('10', 'ether',)
    	});

    	await campaign.withdraw();
    	let finalBalance = await web3.eth.getBalance(accounts[0]);
		finalBalance = web3.fromWei(finalBalance, 'ether');
		finalBalance = parseFloat(finalBalance);
		assert(finalBalance > (initialBalance - 0.3)); // Assuming 0.3 is burnt in gas
	});

	it('Prevent contribution after deadline passes', async () => {
    	try {
			var deadLine = Math.round(Date.now() / 1000) + 2;

	    	let eventDetails = await factory
	    	.createCampaign(
	    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
	    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];

	    	campaign = await Campaign.at(addressFromEvent);

			await timeout(4000);

	    	await campaign.contribute({
	    		from: accounts[0],
	    		value: 100000000000,
	    	});

	    	assert(false);
		} catch (err) {
				assert(err);
		}

	});

	it('Prevent creation of requests if goal is not reached', async () => {
		try {
			var deadLine = Math.round(Date.now() / 1000) + 2;

	    	let eventDetails = await factory
	    	.createCampaign(
	    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
	    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];

	    	campaign = await Campaign.at(addressFromEvent);
	    	await campaign.contribute({
	    		from: accounts[0],
	    		value: 10000000000,
	    	});

			await timeout(4000);

	    	await campaign.createRequest('Buy batteries', '10000000000', accounts[1]);
	    	assert(false);
		} catch (err) {
			assert(err)
		}
	});

	it('Refund after deadline crosses', async () => {
    	let initialBalance = await web3.eth.getBalance(accounts[0]);
		initialBalance = web3.fromWei(initialBalance, 'ether');
		initialBalance = parseFloat(initialBalance);

		var deadLine = Math.round(Date.now() / 1000) + 2;

		let eventDetails = await factory.createCampaign(
	    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
    	addressFromEvent = eventDetails['logs'][1]['args']['campaignAddress'];

    	campaign = await Campaign.at(addressFromEvent);
    	await campaign.contribute({
    		from: accounts[0],
    		value: web3.toWei('10', 'ether',)
    	});

		await timeout(4000);

		await campaign.refundBackerFunds();
    	await campaign.withdraw();
    	let finalBalance = await web3.eth.getBalance(accounts[0]);
		finalBalance = web3.fromWei(finalBalance, 'ether');
		finalBalance = parseFloat(finalBalance);
		assert(finalBalance > (initialBalance - 0.3)); // Assuming 0.3 is burnt in gas
	});

	it('Prevent creation of campaigns after Circuit breaker activated on Factory ', async () => {
		try {
			await factory.pause();
			var deadLine = Math.round(Date.now() / 1000) + 2;
			let eventDetails = await factory.createCampaign(
		    		"Laptop bags", 10000000, deadLine, 100000000000, "Create Macbook laptop bags");
			assert(false);			
		} catch(err) {
			assert(err);
		}
	});

});