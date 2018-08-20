import React, { Component } from 'react';
import { Message, Button, Container, Divider, Segment } from 'semantic-ui-react';
import Campaign from '../lib/campaign';
import web3 from '../lib/web3';
import { Router } from '../routes';

class EmergencyStop extends Component {

	state = {
		errorMessage: '',
		successMessage:'',
		loading: false,
	}

	stop = async event => {
		event.preventDefault();
		const campaign = Campaign(this.props.address);

		this.setState({ loading: true, errorMessage: '', successMessage: '' });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.pause().send({
				from: accounts[0]
			});

			this.setState({ successMessage: 'Contributions and request creation has been stopped on this Campaign.', errorMessage: '' });

		} catch(err) {
			this.setState({ errorMessage: err.message, successMessage: '' });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<Container>
				<Segment basic>
					<Button fluid loading={this.state.loading} floated="right" content="Emergency Stop" icon='minus circle' labelPosition='right' color='red' onClick={this.stop}/>
					<Divider hidden />
				</Segment>
					<Message error header="Oops !" hidden={!this.state.errorMessage || !this.state.successMessage} content={this.state.errorMessage || this.state.successMessage} />
			</Container>
		)
	}
}

export default EmergencyStop;
