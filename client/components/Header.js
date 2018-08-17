import React, { Component } from 'react';
import web3 from '../lib/web3';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

class HeaderComponent extends Component {

	state = {
		account: ''
	}

	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });
	}


	render() {
		return (
			<Menu style={{ marginTop: '10px' }}>
				<Link route="/">
					<a className="item">CrowdCoin</a>
				</Link>
				<Menu.Menu position="right">
					<Menu.Item name='user'>
					Hello {this.state.account} !
					</Menu.Item>
				</Menu.Menu>
			</Menu>
		);
	}
};

export default HeaderComponent;
