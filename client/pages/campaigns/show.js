import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../lib/campaign';
import { Table, Grid, Button } from 'semantic-ui-react';
import moment from 'moment';
import web3 from '../../lib/web3';
import { Link } from '../../routes';
import ContributeForm from '../../components/ContributeForm';
import RatingComponent from '../../components/RatingComponent';
import WithdrawButton from '../../components/WithdrawButton';
import RefundButton from '../../components/RefundButton';
import EmergencyStop from '../../components/EmergencyStop';

class CampaignShow extends Component {

	state = {
    	accounts: ''
  	};

	static async getInitialProps(props) {
		const campaign = Campaign(props.query.address);

		const campaignStatus = await campaign.methods.getCampaignStatus().call();
		const summary = await campaign.methods.getSummary().call();
 
		return {
			nameOfCampaign: summary[0],
			manager: summary[1],
			minimumContribution: summary[2],
			deadline: summary[3],
			goal: summary[4],
			details: summary[5],
			amountRaised: summary[6],
			amountRemaining: summary[7],
			requestsCount: summary[8],
			rating: summary[9],
			backersCount: summary[10],
			paused: campaignStatus[0],
			refundFlag:campaignStatus[1],
			address: props.query.address
		};
	}

	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		this.setState({ accounts });
	}

	renderTable() {

		// Destructuring from the props
		const {
			nameOfCampaign,
			address,
			manager,
			minimumContribution,
			deadline,
			goal,
			details,
			amountRaised,
			amountRemaining,
			requestsCount,
			rating,
			backersCount
		} = this.props;

		const deadlineDateTimeFormat = moment.unix(deadline).utc().format('dddd, MMMM Do, YYYY h:mm:ss A');

		const renderBodyRow = ({ name, value}, i) => ({
		  key: name || `row-${i}`,
		  cells: [
		    name || 'No name specified',
		    value ? { key: 'value', content: value } : 'None',
		  ],
		});

		const tableData = [
		  { name: 'Name', value: nameOfCampaign },
		  { name: 'Address', value: address },
		  { name: 'Manager', value: manager },
		  { name: 'Minimum Contribution', value: web3.utils.fromWei(minimumContribution, 'ether') + ' ETH' },
		  { name: 'Deadline', value: deadlineDateTimeFormat },
		  { name: 'Goal', value: web3.utils.fromWei(goal, 'ether') + ' ETH' },
		  { name: 'Amount Raised', value: web3.utils.fromWei(amountRaised, 'ether') + ' ETH' },
		  { name: 'Details', value: details },
		  { name: 'Number of Requests', value: requestsCount },
		  { name: 'Amount Remaining', value: web3.utils.fromWei(amountRemaining, 'ether') + ' ETH' },
		  { name: 'Number of Backers', value: backersCount },
		  { name: 'Rating of this Campaign', value: (rating != 0 ? rating : 'NA') }
		];

		return <Table compact celled striped definition selectable renderBodyRow={renderBodyRow} tableData={tableData} />
	}


	render() {
		return (
			<Layout>
				<h3>Campaign Details</h3>
				<Grid>
					<Grid.Row>
						<Grid.Column width={10}>
							{this.renderTable()}
						</Grid.Column>
						<Grid.Column width={6}>
							<ContributeForm address={this.props.address}/>
							<WithdrawButton address={this.props.address}/>
							<div>
								{
									(this.state.accounts[0] == this.props.manager) ?
									<div>
										<RefundButton address={this.props.address}/>
										<EmergencyStop address={this.props.address} paused={this.props.paused}/>
									</div>
									: null
								}
							</div>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={4}>
							<Link route={`/campaigns/${this.props.address}/requests`}>
								<a>
									<Button primary>View/Create Payment Requests</Button>
								</a>
							</Link>
						</Grid.Column>
						<Grid.Column width={4}>
							<RatingComponent address={this.props.address}/>
						</Grid.Column>
					</Grid.Row>

				</Grid>
			</Layout>
		)
	}
}

export default CampaignShow;