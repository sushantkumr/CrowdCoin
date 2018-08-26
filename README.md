# CrowdCoin
Decentralized Kickstarter

Raise funds for your project or venture the decentralized way.
Backers can be assured that the money they contribute is used for the right purposes by approving the usage.
Refunds are possible if the manager decides to return the surplus.

This project has been made using [Truffle-Next box](https://github.com/adrianmcli/truffle-next)


## Prerequisites

##### Setting up the VM (for Ubuntu 16.04 with atleast 4 GB of RAM)
* If you're using VirtualBox to create the VM, install the dependancies present in [setup_dev_env.sh](https://gist.github.com/sushantkumr/3fe3cb3507a3d25eeed237065f5ef46e#file-setup_dev_env-sh]) by running the script in a terminal.


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

## FAQs

#### How to create a Campiagn
* Unlock Metamask and switch to Rinkeby network. (Make sure you have some test ETH).
* Click on the `Create Campaign` button on the Homepage.
* Enter all necessary details in the form for the Campaign.
* On hitting the `Submit` button, a Metamask notification pops up. Confirm the transaction.
* You will be redirected to the home page which lists all the Ongoing and Completed Campaigns.
* To find the campaign created by you, click on your address in the Menu bar. (Example: `Hello 0x0000000000000000000000000000000000000000 !`)
* In your profile, you can find the Campaign created under `Campaign Creators` and sub menu `Ongoing Campaigns`.

#### How to contribute to Campaigns
* Go to the Campaign details page by clicking on `View Campaign` and enter the minimum amount or more in the Contribute field.
* Click on Contribute and confirm the transaction.
* The page reloads and updates the Campaign information.

#### How to create Requests
* Go to the Campaign Page -> View Requests -> Create Request.
* Enter all necessary details.
* Click on `Create` and confirm the transaction.

#### How to process Requests
* Go to the Campaign Page -> View Requests.
* If you re the Backer of the Campaign then click on `Approve` and confirm the transaction.
* If you re the Manager of the Campaign and if the request has secured more than 50% of the backers apporval then click on `Finalize` and confirm the transaction.

#### When can a backer withdraw funds from a Campaign?
* Before the deadline
* If the campaign manager activates Refunds. (Even if the some Requests have been processed, refunds will be made proportional to the contribution).
* If the goal is not met.

#### Who can activate Circuit breaker/Emergency Stop? What operations does it affect?
* The creator of the Contracts controls the Circuit breaker of the Factory contract. It affects the creation of Campaigns.
* The creator of the Campaign controls the Circuit breaker of the Campaign. It affects contribution to Campaigns and creation of requests.

#### When can a backer give rating to the Campaign?
* After the deadline the backer can rate the Campaign anytime. If the refund is activated then the backer can rate and then withdraw his funds.


## Tests are explained [here](test_description.md)
* Tests can be run be inside the truffle console `truffle develop` and then executing `test`.


## If you wish to change ownership of the Factory contract, check [this](change_ownership_of_factory.md)