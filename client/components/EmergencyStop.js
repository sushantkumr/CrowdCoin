import React, { Component } from 'react';
import { Message, Button, Divider, Segment } from 'semantic-ui-react';
import Campaign from '../lib/campaign';
import web3 from '../lib/web3';
import { Router } from '../routes';

class EmergencyStop extends Component {

	state = {
		errorMessageStop: '',
		successMessageStop:'',
		loadingStop: false,
		errorMessageResume: '',
		successMessageResume:'',
		loadingResume: false,
	}

	stop = async event => {
		event.preventDefault();
		const campaign = Campaign(this.props.address);

		this.setState({ loadingStop: true, errorMessageStop: '', successMessageStop: '' });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.pause().send({
				from: accounts[0]
			});
			
			Router.replaceRoute(`/campaigns/${this.props.address}`);
			this.setState({ successMessageStop: 'Contributions and request creation has been stopped on this Campaign.', errorMessage: '' });

		} catch(err) {
			this.setState({ errorMessageStop: err.message, successMessageStop: '' });
		}

		this.setState({ loadingStop: false });
	};

	resume = async event => {
		event.preventDefault();
		const campaign = Campaign(this.props.address);

		this.setState({ loadingResume: true, errorMessageResume: '', successMessageResume: '' });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.unpause().send({
				from: accounts[0]
			});
			
			Router.replaceRoute(`/campaigns/${this.props.address}`);
			this.setState({ successMessageResume: 'Contributions and request creation has been stopped on this Campaign.', errorMessage: '' });

		} catch(err) {
			this.setState({ errorMessageResume: err.message, successMessageResume: '' });
		}

		this.setState({ loadingResume: false });
	};

	render() {
		return (
			<div>
				{
					(!this.props.paused) ?
					<div>
						<Segment basic>
							<Button 
								fluid 
								loading={this.state.loadingStop} 
								floated="right" 
								content="Emergency Stop" 
								icon='pause circle' 
								labelPosition='right' 
								color='red' 
								onClick={this.stop}/>
							<Divider hidden />
						</Segment>
							<Message 
								error 
								header="Oops !" 
								hidden={!this.state.errorMessageStop || !this.state.successMessage} 
								content={this.state.errorMessageStop || this.state.successMessageStop} />
					</div> :
					<div>
						<Segment basic>
							<Button 
								fluid 
								loading={this.state.loadingResume} 
								floated="right" 
								content="Resume operations" 
								icon='play circle' 
								labelPosition='right' 
								color='olive' 
								onClick={this.resume}/>
							<Divider hidden />
						</Segment>
							<Message 
								error 
								header="Oops !" 
								hidden={!this.state.errorMessageResume || !this.state.successMessageResume} 
								content={this.state.errorMessageResume || this.state.successMessageResume} />
					</div>
				}

			</div>
		)
	}
}

export default EmergencyStop;
