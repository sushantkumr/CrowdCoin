import React, { Component } from 'react';
import factory from '../../lib/factory';
import { Card, Button, Grid, Container, Divider, Segment , Menu } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';

class UserIndex extends Component {

	constructor(props) {
    	super(props);
    	this.state = {
      		showOngoing: true,
      		showCompleted: false,
      		activeItem: 'campaignCreator',
    	};
    	this.ongoingClicked = this.ongoingClicked.bind(this);
    	this.completedClicked = this.completedClicked.bind(this);
  	}

	static async getInitialProps() {

		const accounts = await web3.eth.getAccounts();
		const campaigns = await factory.methods
		.getCampaigns("0x0000000000000000000000000000000000000000", 0)
		.call();

		const completedCampaigns = (campaigns["completedCampaigns"]);
		const ongoingCampaigns = (campaigns["ongoingCampaigns"]);

		return { completedCampaigns, ongoingCampaigns };
	}

  	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	renderCompletedCampaigns() {
		const items = this.props.completedCampaigns
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

		return (
				<div>
					<h3>Completed Campaigns</h3>
					<Card.Group items={items} />
				</div>
				);
	}

	renderOngoingCampaigns() {
		const items = this.props.ongoingCampaigns
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

		return (
				<div>
					<h3>Ongoing Campaigns</h3>
					<Card.Group items={items} />
				</div>
				);
	}

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
				<h3>User Profile</h3>
				<Divider hidden />

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
				<Divider hidden />

				<Grid columns={2} divided>
					<Grid.Row>
						<Grid.Column floated="left" width={8}>
		    				<div>
		    					{
		    						this.state.showOngoing ?
		    							<div> {this.renderOngoingCampaigns()} </div>
    								: null
       							}
		    				</div>
		    				<div>
		    					{
		    						this.state.showCompleted ?
		    							<div> {this.renderCompletedCampaigns()} </div>
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
