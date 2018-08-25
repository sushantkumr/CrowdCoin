import factoryDefinition from './contracts/CampaignFactory.json';
import web3 from './web3';

const deployedAddress = "0xbD6d021E0040D3C6D676671bB2A09e09B7F98A8f";

const instance = new web3.eth.Contract(
    factoryDefinition.abi,
    deployedAddress
  );
export default instance;
