import React, { Component } from 'react';
import factory from '../../lib/factory';
import { Card, Button, Grid } from 'semantic-ui-react';
import Layout from '../../components/Layout';

class User extends Component {

	static async getInitialProps() {
	    const accounts = await web3.eth.getAccounts();
		const campaigns = await factory.methods
		.getCampaigns(accounts[0], 0)
		.call();
		
		const completedCampaigns = (campaigns["completedCampaigns"]);
		const ongoingCampaigns = (campaigns["ongoingCampaigns"]);

		return { completedCampaigns, ongoingCampaigns };
	}

	renderCompletedCampaigns() {
		const items = this.props.completedCampaigns
		.filter(address => address != "0x0000000000000000000000000000000000000000")
		.map(address => {
				return {
					header: address,
					description: <a>View Campaign</a>,
					fluid: true
				};				
		});

		return <Card.Group items={items} />;
	}

	renderOngoingCampaigns() {
		const items = this.props.ongoingCampaigns
		.filter(address => address != "0x0000000000000000000000000000000000000000")
		.map(address => {
				return {
					header: address,
					description: <a>View Campaign</a>,
					fluid: true
				};				
		});

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
			<h3>Your profile</h3>

			<div>
				<Grid columns={2} divided>
					<Grid.Row>
						<Grid.Column floated="left" width={8}>
		    				<h3>Ongoing Campaigns</h3>

		    				<div>
		    					{this.renderOngoingCampaigns()}
		    				</div>
						</Grid.Column>

						<Grid.Column floated="right" width={6}>
			    			<div className="ui vertical buttons">
				    			<Button floated="right" content='Create Campaign' icon='add circle' labelPosition='right' primary />
				    			<Button floated="right" content='Ongoing Campaigns' icon='hourglass start' labelPosition='right' />
				    			<Button floated="right" content='Completed Campaigns' icon='hourglass end' labelPosition='right' />
							</div>
						</Grid.Column>

					</Grid.Row>
    			</Grid>
    			
    		</div>
			</Layout>
    		)
    		
	}
}

export default CampaignIndex;
