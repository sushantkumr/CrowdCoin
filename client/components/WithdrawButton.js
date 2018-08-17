import React, { Component } from 'react';
import { Message, Button, Container, Divider, Segment } from 'semantic-ui-react';
import Campaign from '../lib/campaign';
import web3 from '../lib/web3';
import { Router } from '../routes';

class WithdrawButton extends Component {

	state = {
		errorMessage: '',
		successMessage:'',
		loading: false,
	}

	withdraw = async event => {
		console.log('Withdraw');
		event.preventDefault();
		const campaign = Campaign(this.props.address);

		this.setState({ loading: true, errorMessage: '', successMessage: '' });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.withdraw().send({
				from: accounts[0]
			});

			Router.replaceRoute(`/campaigns/${this.props.address}`)

		} catch(err) {
			this.setState({ errorMessage: err.message, successMessage: '' });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<Container>
				<Segment basic>
					<Button fluid loading={this.state.loading} floated="right" content="Withdraw" icon='minus circle' labelPosition='right' color='green' onClick={this.withdraw}/>
					<Divider hidden />
				</Segment>
					<Message error header="Oops !" hidden={!this.state.errorMessage || !this.state.successMessage} content={this.state.errorMessage || this.state.successMessage} />
			</Container>
		)
	}
}

export default WithdrawButton;
