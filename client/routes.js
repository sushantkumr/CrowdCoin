const routes = require('next-routes')(); // Returns a function

routes
	.add('/campaigns/new', '/campaigns/new') // Goes before because "new" can also be a token for address
	.add('/campaigns/:address', '/campaigns/show')
	.add('/campaigns/:address/requests', '/campaigns/requests/index')
	.add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;