import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import Campaign from '../../../lib/campaign';

class RequestIndex extends Component {

	static async getInitialProps(props) {
		const { address } = props.query;
		const campaign = Campaign(address);
		const requestCount = await campaign.methods.getRequestsCount().call();
		const backersCount = await campaign.methods.backersCount().call();

	    const requests = await Promise.all(
	      Array(parseInt(requestCount))
	        .fill()
	        .map((element, index) => {
	          return campaign.methods.requests(index).call();
	        })
	    );

		return { address, requests, requestCount, backersCount };
	}

	renderRow() {
		return this.props.requests.map((request, index) => {
			return <RequestRow 
				key={index}
				id={index}
				request={request}
				address={this.props.address}
				backersCount={this.props.backersCount}
			/>
		});
	}

	render() {

		const { Header, Row, HeaderCell, Body } = Table;

		return (
			<Layout>
				<Link route={`/campaigns/${this.props.address}`}>
          			<a>Back</a>
        		</Link>
				<h3>Requests</h3>
				<Link route={`/campaigns/${this.props.address}/requests/new`}>
					<a>
						<Button primary floated="right" style={{ marginBottom: 10 }}>Create Request</Button>
					</a>
				</Link>

				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Recipient</HeaderCell>
							<HeaderCell>Approval Count</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>

					<Body>
						{this.renderRow()}
					</Body>

				</Table>

				<div>Found {this.props.requestCount} requests.</div>

			</Layout>
		);
	}
}

export default RequestIndex;