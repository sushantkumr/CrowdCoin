const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const factory = require('./lib/contracts/CampaignFactory.json');

const provider = new HDWalletProvider(
	'invest giraffe energy size lottery kitchen strategy shoe time hockey follow ritual',
	 'https://rinkeby.infura.io/Lr1n4jxK5ZjOyMUPnyNw'
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('Deploying from account', accounts[0]);

	const result = await new web3.eth.Contract(factory.abi)
		.deploy({ data: factory.bytecode })
		.send({ gas: '5000000', from: accounts[0] });

	console.log('Contract deployed to:', result.options.address);
};

deploy();