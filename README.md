# CrowdCoin
Decentralized Kickstarter

Raise funds for your project or venture the decentralized way.
Backers can be assured that the money they contribute is used for the right purposes by approving the usage.
Refunds are possible if the manager decides to return the surplus.

This project has been made using [Truffle-Next box](https://github.com/adrianmcli/truffle-next)


## Prerequisites

##### Setting up the VM.
* If you're using VirtualBox to create the VM, install the dependancies present in [setup_dev_env.sh](https://gist.github.com/sushantkumr/3fe3cb3507a3d25eeed237065f5ef46e#file-setup_dev_env-sh]) by running the script in a terminal.
* If you wish to maintain the VM via [Vagrant](https://www.vagrantup.com/downloads.html). To setup a VM in Vagrant and install dependancies of this repo, click [here](https://gist.github.com/sushantkumr/3fe3cb3507a3d25eeed237065f5ef46e). 


##### Metamask
* Install the Metamask plugin from [here](https://metamask.io/).
* Switch to Rinkeby network in Metamask. Procure some Rinkeby test ETH from the [faucet](https://www.rinkeby.io/#faucet).


## How to setup the repo for a local system
* Once you're inside the VM and have installed the dependancies from [here](https://github.com/sushantkumr/CrowdCoin#setting-up-the-vm) follow the steps listed below
* Clone the repo in your local file system
* Traverse to `/client` and run `npm install` in the terminal
* Run `npm run dev` whilst you're in `/client` to start the development server
* Open either Chrome/Firefox and unlock Metamask
* Access the DApp from [localhost:3000](http://localhost:3000/)
* 

## FAQs can be found [here](faqs.md)

## Tests are explained [here](test_description.md)
* Tests can be run be inside the truffle console `truffle develop` and then executing `test`.
