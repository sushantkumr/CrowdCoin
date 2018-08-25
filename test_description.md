# Test Description

Explanation of tests in [crowdcoin.test.js](./test/crowdcoin.test.js)
Tests have been written in accordance to truffle testing dynamics.
Usage of beforeEach() has been made to deploy a new set of contracts before every test. Hence the test accounts will not have sufficient ETH if tests are run again and again (approx 10-12 times).

##### Test 1 -`CampaignFactory deployment`
Basic test to check if deployment has been made

##### Test 2 -`Create a new Campaign`
Basic test to check if deployment has been made

##### Test 3 -`Caller as a campaign manager`
Basic test to check if deployment has been made

##### Test 4 -`Get ongoing Campaigns`
Basic test to check if deployment has been made

##### Test 5 -`Get completed Campaigns`
Basic test to check if deployment has been made

##### Test 6 -`Allows people to contribute to Campaigns and marks them as contributor`
Basic test to check if deployment has been made

##### Test 7 -`Camaigns require a minimum contribution`
Basic test to check if deployment has been made

##### Test 8 -`Allows a manager to create a payment request`
Basic test to check if deployment has been made

##### Test 9 -`Processes requests`
Basic test to check if deployment has been made

##### Test 10 -`Withdrawal from a Campaign is allowed`
Basic test to check if deployment has been made

##### Test 11 -`Prevent contribution after deadline passes`
Basic test to check if deployment has been made

##### Test 12 -`Prevent creation of requests if goal is not reached`
Basic test to check if deployment has been made

##### Test 13 -`Refund after deadline crosses`
Basic test to check if deployment has been made

##### Test 14 -`Prevent creation of campaigns after Circuit breaker activated on Factory`
Basic test to check if deployment has been made
