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
			<Menu style={{ marginTop: '35px' }}>
				<Menu.Item header>CrowdCoin</Menu.Item>
				<Menu.Item link position="left">
					<Link route="/">
						<a color="black">Home</a>
					</Link>
				</Menu.Item>
				<Menu.Item link position="right">
					<Link route={`/user/${this.state.account}`}>
						<a color="black">Hello {this.state.account} !</a>
					</Link>
				</Menu.Item>
			</Menu>
		);
	}
};

export default HeaderComponent;
