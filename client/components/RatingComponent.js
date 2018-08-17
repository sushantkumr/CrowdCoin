import React, { Component } from 'react';
import { Form, Input, Message, Button, Rating, Loader, Segment, Divider } from 'semantic-ui-react';
import Campaign from '../lib/campaign';
import web3 from '../lib/web3';
import { Router } from '../routes';


class RatingComponent extends Component {

	state = {
		rating: 0,
		errorMessage: '',
		loading: false
	};

	handleRate = async (e, { rating }) => {
		this.setState({ rating: rating});

		event.preventDefault();
		console.log(this.props.address);
		const campaign = Campaign(this.props.address);

		this.setState({ loading: true, errorMessage: '' });

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.giveRating(rating).send({
				from: accounts[0],
			});

			Router.replaceRoute(`/campaigns/${this.props.address}`)

		} catch(err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
		
	};

	render() {
		return  (
			<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
					<Form.Field inline>
						<Segment basic>
							<div>
								Give Rating&nbsp;&nbsp;&nbsp;
								<Rating icon='star' maxRating={5} clearable rating={this.state.rating} onRate={this.handleRate} />
								<Loader active={this.state.loading} inline />
							</div>
							<Divider hidden />
						</Segment>
						
					</Form.Field>
					<Message error header="Oops !" content={this.state.errorMessage} />
				</Form>
		)
	}
}

export default RatingComponent;