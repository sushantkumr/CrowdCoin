# Test Description

Explanation of tests in [crowdcoin.test.js](./test/crowdcoin.test.js)
Tests have been written in accordance to truffle testing dynamics.
Usage of beforeEach() has been made to deploy a new set of contracts before every test. Hence the test accounts will not have sufficient ETH if tests are run again and again (approx 10-12 times).

##### Test 1 -`CampaignFactory deployment`
Basic test to check if deployment has been made

##### Test 2 -`Create a new Campaign`
Create a new campaign and check under deployed campaigns

##### Test 3 -`Caller as a campaign manager`
Check if the user who created the campaign has been assigned the role of manager

##### Test 4 -`Get ongoing Campaigns`
Deploy multiple campaigns and get a list of ongoing campaigns

##### Test 5 -`Get completed Campaigns`
Deploy multiple campaigns and after a delay which is enough to cross the deadlines, get a list of completed campaigns

##### Test 6 -`Allows people to contribute to Campaigns and marks them as contributor`
Checks if users who contributed to a campaign are listed as backers of the same.

##### Test 7 -`Camaigns require a minimum contribution`
Checks if the user's contribution qualifies is equal to or more than the minimum for the campaign

##### Test 8 -`Allows a manager to create a payment request`
Manager can create a request to use the funds raised for his Campaign

##### Test 9 -`Processes requests`
Manager can process a request once it has been approved by more than 50% of the backers

##### Test 10 -`Withdrawal from a Campaign is allowed`
Checks if a user is able to withdraw his/her contribution before the deadline

##### Test 11 -`Prevent contribution after deadline passes`
Users cannot contribute to a Campaign after a deadline has passed

##### Test 12 -`Prevent creation of requests if goal is not reached`
If the goal of the campaign is not reached then requests cannot be created.

##### Test 13 -`Refund after deadline crosses`
Incase the manager of the campaign decided to refund the funds even after the deadline has passed

##### Test 14 -`Prevent creation of campaigns after Circuit breaker activated on Factory`
Disallow creation of campaigns if the creator of the contracts activates emergency stop on CampaignFactory.
