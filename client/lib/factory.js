import factoryDefinition from './contracts/CampaignFactory.json';
import web3 from './web3';

const deployedAddress = "0x312F02d878a46D85c8073828FA9Bf5dF391c3Aa0";

const instance = new web3.eth.Contract(
    factoryDefinition.abi,
    deployedAddress
  );
export default instance;
