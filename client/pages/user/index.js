import React, { Component } from 'react';
import factory from '../../lib/factory';
import { Card, Button, Grid, Container, Divider, Segment , Menu } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import web3 from '../../lib/web3';

class UserIndex extends Component {

	constructor(props) {
    	super(props);
    	this.state = {
      		showOngoing: true,
      		showCompleted: false,
      		activeItem: 'campaignCreator',
      		accounts: [],
      		creatorCompleted: [],
      		creatorOngoing: [],
      		backerCompleted: [],
      		backerOngoing: [],
    	};
    	this.ongoingClicked = this.ongoingClicked.bind(this);
    	this.completedClicked = this.completedClicked.bind(this);
  	}

	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		this.setState({ accounts });

		const campaignCreatorList = await factory.methods
		.getCampaigns(accounts[0] , 1)
		.call();

		const campaignBackerList = await factory.methods
		.getCampaigns(accounts[0] , 2)
		.call();

		this.setState({creatorCompleted: (campaignCreatorList["completedCampaigns"])});
		this.setState({creatorOngoing: (campaignCreatorList["ongoingCampaigns"])});

		this.setState({backerCompleted: (campaignBackerList["completedCampaigns"])});
		this.setState({backerOngoing: (campaignBackerList["ongoingCampaigns"])});
	}


	renderCampaigns(props) {
		let items;

		if (typeof props !== 'undefined' && props.length > 0) {
			items = props
			.filter(address => address != "0x0000000000000000000000000000000000000000")
			.map(address => {
					return {
						header: address,
						description: (
								<Link route={`/campaigns/${address}`}>
									<a>View Campaign</a>
								</Link>
								),
						fluid: true
					};				
			});			
		}

		return (
				<div>
					<Card.Group items={items} />
				</div>
				);
	}

  	campaignListCompute(choice) {
  		if(this.state.activeItem === 'campaignCreator') {
  			if (choice == 1) {
  				return (
  					<div>
  						<h3>Ongoing Campaigns</h3>
  						{this.renderCampaigns(this.state.creatorOngoing)}
  					</div>
				);
  			}
  			else {
  				return (
  					<div>
  						<h3>Completed Campaigns</h3>
  						{this.renderCampaigns(this.state.creatorCompleted)}
  					</div>
				);
  			}
  		}

  		else {
  			if (choice == 1) {
  				return (
  					<div>
  						<h3>Ongoing Campaigns</h3>
  						{this.renderCampaigns(this.state.backerOngoing)}
  					</div>
				);
  			}
  			else {
  				return (
  					<div>
  						<h3>Completed Campaigns</h3>
  						{this.renderCampaigns(this.state.backerCompleted)}
  					</div>
				);
  			}
  		}
  	}

  	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  	ongoingClicked() {
    	this.setState({
      		showOngoing: true,
      		showCompleted: false,

    	});
  	}

  	completedClicked() {
    	this.setState({
      		showOngoing: false,
      		showCompleted: true,
    	});
  	}

	render() {
		return (
			<Layout>
			<div>
				<Divider hidden />
				<h2>User Profile</h2>

				<Menu secondary>
					<Menu.Item
					  name='campaignCreator'
					  active={this.state.activeItem === 'campaignCreator'}
					  onClick={this.handleItemClick}
					/>
					<Menu.Item
					  name='backer'
					  active={this.state.activeItem === 'backer'}
					  onClick={this.handleItemClick}
					/>
				</Menu>
				<Divider hidden />

				<Grid columns={2} divided>
					<Grid.Row>
						<Grid.Column floated="left" width={8}>
		    				<div>
		    					{
		    						this.state.showOngoing ?
		    							<div> {this.campaignListCompute(1)} </div>
    								: null
       							}
		    				</div>
		    				<div>
		    					{
		    						this.state.showCompleted ?
		    							<div> {this.campaignListCompute(2)} </div>
    								: null
       							}
		    				</div>
						</Grid.Column>

						<Grid.Column floated="right" width={4}>
			    			<div className="ui vertical buttons">
				    			<Button floated="right" content='Ongoing Campaigns' icon='hourglass start' labelPosition='right' onClick={this.ongoingClicked}/>
				    			<Button floated="right" content='Completed Campaigns' icon='hourglass end' labelPosition='right' onClick={this.completedClicked}/>
							</div>
						</Grid.Column>

					</Grid.Row>
    			</Grid>
    			
    		</div>
			</Layout>
    		)
    		
	}
}

export default UserIndex;
