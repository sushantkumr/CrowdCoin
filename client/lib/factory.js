import factoryDefinition from './contracts/CampaignFactory.json';
import web3 from './web3';

const deployedAddress = "0x13FbD23843Ad1D14e011563ed8Bab401bDc0177C";

const instance = new web3.eth.Contract(
    factoryDefinition.abi,
    deployedAddress
  );
export default instance;
