import React, { Component } from 'react';
import { Form, Button, Container, Input, Message } from 'semantic-ui-react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Layout from '../../components/Layout';
import factory from '../../lib/factory';
import web3 from '../../lib/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {

	constructor (props) {
    	super(props)
    	this.state = {
      		startDate: moment.utc(),
			name: '',
			minimumContribution: '',
			goal: '',
			details: '',
			errorMessage: '',
			loading: false
    	};
    	this.handleChange = this.handleChange.bind(this);
  	}

  	handleChange(date) {
    	this.setState({
      		startDate: date
    	});
  	}

  	onFieldChange(fieldName) {
        return function (event) {
            this.setState({[fieldName]: event.target.value});
        }
    }

    onSubmit = async (event) => {
    	event.preventDefault();
    	this.setState({ loading: true, errorMessage: '' });

    	try {
	    	const accounts = await web3.eth.getAccounts();
	    	await factory.methods
	    		.createCampaign(
	    				this.state.name,
	    				this.state.minimumContribution,
	    				this.state.startDate.unix(),
	    				this.state.goal,
	    				this.state.details)
	    		.send({
	    			from: accounts[0]
	    		});

    		Router.pushRoute('/');

    	} catch (err) {
    		this.setState({ errorMessage: err.message });
    	}

    	this.setState({ loading: false });

    };


	render() {
		return (
			<Layout>
				<h3>Create a Campaign</h3>

				<Container>
					<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} >
						<Form.Field required >
							<label>Name</label>
							<Input placeholder='Name of the Campaign'
								   value={this.state.name}
								   onChange={this.onFieldChange('name').bind(this)}
							/>
						</Form.Field>

						<Form.Field required >
							<label>Minimum Contribution</label>
							<Input placeholder='Minimum contribution for this Campaign' 
								   label="wei"
								   labelPosition="right"
								   value={this.state.minimumContribution}
								   onChange={this.onFieldChange('minimumContribution').bind(this)}
						   	/>
						</Form.Field>

						<Form.Field required >
							<label>Deadline <small>(in UTC)</small></label>
							<DatePicker selected={this.state.startDate}
										startDate={this.state.startDate}
										showTimeSelect
										minDate={moment.utc()}
										minTime={moment.utc()}
										maxTime={moment.utc().hours(23).minutes(59)}
										timeFormat="HH:mm"
    									timeIntervals={15}
									    dateFormat="LLL"
									    timeCaption="Time"
										onChange={this.handleChange} 
							/>
						</Form.Field>

						<Form.Field required >
							<label>Goal</label>
							<Input placeholder='Amount required for this Campaign' 
								   label="wei" 
								   labelPosition="right"
								   value={this.state.goal}
								   onChange={this.onFieldChange('goal').bind(this)}
							/>
						</Form.Field>

						<Form.Field required >
							<label>Details</label>
							<Input placeholder='Some details about this Campaign.'
								   value={this.state.details}
								   onChange={this.onFieldChange('details').bind(this)}
							/>
						</Form.Field>

						<Message error 
							header="There was a problem submitting the form !" 
							content={this.state.errorMessage} 
						/>

		    			<Button loading={this.state.loading} floated="left" content='Create' icon='add circle' labelPosition='right' primary />
					</Form>
				</Container>
			</Layout>
		);
	}
}

export default CampaignNew;