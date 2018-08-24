# How to create a Campiagn
* Unlock Metamask and switch to Rinkeby network. (Make sure you have some test ETH).
* Click on the `Create Campaign` button on the Homepage.
* Enter all necessary details in the form for the Campaign.
* On hitting the `Submit` button, a Metamask notification pops up. Confirm the transaction.
* You will be redirected to the home page which lists all the Ongoing and Completed Campaigns.
* To find the campaign created by you, click on your address in the Menu bar.
* In your profile, you can find the Campaign created under `Campaign Creators` and sub menu `Ongoing Campaigns`.

## Prerequisites

* If you wish to maintain the VM via [Vagrant](https://www.vagrantup.com/downloads.html). To setup a Virtual Machine in Vagrant and install dependancies of this repo. [Click here](https://gist.github.com/sushantkumr/3fe3cb3507a3d25eeed237065f5ef46e)
* [MetaMask](https://metamask.io/).
* Switch to Rinkeby network in Metamask. Procure some Rinkeby test ETH from the faucet.

## How to set it up
* Clone the repo in your local fill system
* Traverse to `/client` and run `npm install` in the terminal
* Run `npm run dev` to start the development server
* Open either Chrome/Firefox and unlock Metamask
* Access the DApp from localhost:5001 if in VM (Changed for guest VM) or localhost:3000 if running in host machine