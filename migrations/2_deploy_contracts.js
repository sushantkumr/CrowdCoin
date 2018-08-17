var CampaignFactory = artifacts.require("./CampaignFactory");
var Campaign = artifacts.require("./Campaign");

module.exports = function(deployer) {

	deployer.deploy(CampaignFactory);
	/*name = "Wildcraft bag";
	minimum = 10000000;
	creator = 0x15EDb534Bc82Fa773b6b7ffA48EAb1E13880A106;
	deadline = 2533212241;
	goal = 100000000;
	details = "Create Wildcraft bags";*/
	//deployer.deploy(Campaign, name, minimum, creator, deadline, goal, details);
};
