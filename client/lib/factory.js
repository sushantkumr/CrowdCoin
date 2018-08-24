import factoryDefinition from './contracts/CampaignFactory.json';
import web3 from './web3';

const deployedAddress = "0x7b0A43A2e84d3A362D0CD37F5d11F38a41a81E16";

const instance = new web3.eth.Contract(
    factoryDefinition.abi,
    deployedAddress
  );
export default instance;
