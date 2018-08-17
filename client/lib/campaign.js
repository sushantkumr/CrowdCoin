import web3 from './web3';
import campaign from './contracts/Campaign.json';

export default (address) => {
	return new web3.eth.Contract(
		campaign.abi,
		address
	);
};
