const path = require('path'); // Help us build a path to Inbox.sol
const fs = require('fs');
const solc = require('solc');


const campaignFactoryPath = path.resolve(__dirname, 'contracts', 'CrowdCoin.sol'); // Path till 'CampaignFactory' folder
const source = fs.readFileSync(campaignFactoryPath, 'utf8');

console.log(solc.compile(source, 1));
module.exports = solc.compile(source, 1).contracts[':CampaignFactory'];
