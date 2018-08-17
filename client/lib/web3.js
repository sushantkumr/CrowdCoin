import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser
  console.log("Injected web3 from Metamask");
  web3 = new Web3(window.web3.currentProvider); // To hijack the web3 injected by Metamask

} else {
  // We are on the server OR the user is not running metamask
  console.log("Infura node and HDWalletProvider");

  const provider = new HDWalletProvider(
	'scout sort custom elite radar rare vivid thing trophy gesture cover snake change narrow kite list nation sustain buffalo erode open balance system young',
	 'https://rinkeby.infura.io/Lr1n4jxK5ZjOyMUPnyNw'
);

  	web3 = new Web3(provider);
}

export default web3;
