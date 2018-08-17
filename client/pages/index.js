import React, { Component } from 'react';
import factory from '../lib/factory';
import { Card, Button, Grid } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {

	static async getInitialProps() { 
		const campaigns = await factory.methods
		.getCampaigns("0x0000000000000000000000000000000000000000", 0)
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
					description: (
							<Link route={`/campaigns/${address}`}>
								<a>View Campaign</a>
							</Link>
							),
					fluid: true
				};				
		});

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Layout>
			<div>
				<Grid columns={2} divided>
					<Grid.Row>
						<Grid.Column floated="left" width={8}>
		    				<h3>Ongoing Campaigns</h3>

		    				<div>
		    					{this.renderOngoingCampaigns()}
		    				</div>
						</Grid.Column>

						<Grid.Column floated="right" width={4}>
			    			<div className="ui vertical buttons">
			    				<Link route="/campaigns/new">
			    					<a>
					    				<Button floated="right" 
					    						content="Create Campaign"
					    						icon='add circle'
					    						labelPosition='right'
					    						primary 
					    				/>
			    					</a>
			    				</Link>
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
