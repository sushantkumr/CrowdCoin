import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../lib/campaign';
import web3 from '../lib/web3';
import { Router } from '../routes';

class RequestRow extends Component {

	state = {
		errorMessageApprove: '',
		loadingApprove: false,
		errorMessageFinalize: '',
		loadingFinalize: false,
	}	

	onApprove = async () => {
		this.setState({ loadingApprove: true, errorMessageApprove: ''});

		try {
			const campaign = Campaign(this.props.address);
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.approveRequest(this.props.id).send({
				from:accounts[0]
			});
		} catch(err) {
			this.setState({ errorMessageApprove: err.message});
		}

		this.setState({ loadingApprove: false });
		Router.replaceRoute(`/campaigns/${this.props.address}/requests`);			
	};

	onFinalize = async () => {
		this.setState({ loadingFinalize: true, errorMessageFinalize: ''});

		try {
			const campaign = Campaign(this.props.address);
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.finalizeRequest(this.props.id).send({
				from:accounts[0]
			});
		} catch(err) {
			this.setState({ errorMessageFinalize: err.message});
		}

		this.setState({ loadingFinalize: false });
		Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
	};

	render() {
		const { Row, Cell } = Table;
		const { id, request, backersCount } = this.props
		const readyToFinalize = request.backerCount > backersCount / 2;

		return (
			<Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
				<Cell>{id}</Cell>
				<Cell>{request.description}</Cell>
				<Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
				<Cell>{request.recipient}</Cell>
				<Cell>{request.backerCount}/{backersCount}</Cell>
				<Cell>
				{request.complete ? null : (
					<Button color='green' onClick={this.onApprove} loading={this.state.loadingApprove}>Approve</Button>
				)}
				</Cell>
				<Cell>
				{request.complete ? null : (
					<Button disabled={!readyToFinalize} color='teal' onClick={this.onFinalize} loading={this.state.loadingFinalize}>Finalize</Button>
				)}
				</Cell>
			</Row>
		);
	}
}

export default RequestRow;