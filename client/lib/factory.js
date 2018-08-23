import factoryDefinition from './contracts/CampaignFactory.json';
import web3 from './web3';

const deployedAddress = "0x8F510aB0572313D8aE322e74Ba566437A8D070c8";

const instance = new web3.eth.Contract(
    factoryDefinition.abi,
    deployedAddress
  );
export default instance;
