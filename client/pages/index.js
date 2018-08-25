import React, { Component } from 'react';
import factory from '../lib/factory';
import web3 from '../lib/web3';
import { Card, Button, Grid, Divider } from 'semantic-ui-react';
import Layout from '../components/Layout';
import FactoryStop from '../components/FactoryStop';
import { Link } from '../routes';

class CampaignIndex extends Component {

	constructor(props) {
    	super(props);
    	this.state = {
      		showOngoing: true,
      		showCompleted: false,
    		accounts: ''
    	};
    	this.ongoingClicked = this.ongoingClicked.bind(this);
    	this.completedClicked = this.completedClicked.bind(this);
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

	static async getInitialProps() { 
		const campaigns = await factory.methods
		.getCampaigns("0x0000000000000000000000000000000000000000", 0)
		.call();

		const paused = await factory.methods.paused().call();
		const owner = await factory.methods.owner().call();

		const completedCampaigns = (campaigns["completedCampaigns"]);
		const ongoingCampaigns = (campaigns["ongoingCampaigns"]);

		return { completedCampaigns, ongoingCampaigns, paused, owner };
	}

	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		this.setState({ accounts });
	}

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

	render() {
		return (
			<Layout>
			<div>
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
				    			<Button 
				    				floated="right" 
				    				content='Ongoing Campaigns' 
				    				icon='hourglass start' 
				    				labelPosition='right' 
				    				onClick={this.ongoingClicked}/>
				    			<Button 
				    				floated="right" 
				    				content='Completed Campaigns' 
				    				icon='hourglass end' 
				    				labelPosition='right' 
				    				onClick={this.completedClicked}/>
				    			<div>
				    				{
				    					(this.props.owner == this.state.accounts[0]) ?
											<FactoryStop paused={this.props.paused}/>
										: null
				    				}
				    			</div>
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
