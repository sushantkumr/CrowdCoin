import React, { Component } from 'react';
import { Message, Button, Container, Divider, Segment } from 'semantic-ui-react';
import Campaign from '../lib/campaign';
import web3 from '../lib/web3';
import { Router } from '../routes';

class RefundButton extends Component {

	state = {
		errorMessage: '',
		successMessage:'',
		loading: false,
	}

	refund = async event => {
		event.preventDefault();
		const campaign = Campaign(this.props.address);

		this.setState({ loading: true, errorMessage: '', successMessage: '' });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.refundBackerFunds().send({
				from: accounts[0]
			});

			this.setState({ successMessage: 'Refund initiated.', errorMessage: '' });

		} catch(err) {
			this.setState({ errorMessage: err.message, successMessage: '' });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<Container>
				<Segment basic>
					<Button fluid loading={this.state.loading} floated="right" content="Refund" icon='undo' labelPosition='right' color='teal' onClick={this.refund}/>
					<Divider hidden />
				</Segment>
					<Message error header="Oops !" hidden={!this.state.errorMessage || !this.state.successMessage} content={this.state.errorMessage || this.state.successMessage} />
			</Container>
		)
	}
}

export default RefundButton;
