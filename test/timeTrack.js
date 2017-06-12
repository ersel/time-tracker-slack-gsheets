const test = require('ava').test;
// test time tracking functionality with Google Sheets Stub
const proxyquire =  require('proxyquire');
const gsheets = require('../lib/gsheets.js');
const gsheetStub = {
	authorize: function() {
		return Promise.resolve('👌');
	},
	getBusinessActivities: function() {
		// google sheets values.get return array of arrays
		//
		let activities = [
			['some business activity', 'alias1, alias2, etc'],
			['another business activity', 'alias3, alias4']
		];
		return Promise.resolve(gsheets.parseActivityListFromSpreadSheet(activities));
	},
	recordTime: function() {
		return Promise.resolve('recorded');
	}
};
const timeTrack = proxyquire('../lib/timeTrack.js', { './gsheets.js': gsheetStub });

test('time track interface', async t => {
	let event = 'token=TOKENID&team_id=TEAMID&team_domain=DOMAIN&channel_id=CHANNELID&channel_name=directmessage&user_id=USERID&user_name=ersel&command=%2Ftrack&text=09205274+%22alias1%22+12m&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTK5K%2F15644%2FlRWL';
	const successPostToSlack = await timeTrack.track(event, 'http://example.com');
	const activityRecord = successPostToSlack.json.text.substring(0, 37);
	t.is(activityRecord, '@ersel has just recorded an activity.');
});

test('new test', async t => {
	const successPostToSlack = await timeTrack.activityList('http://example.com');
	const activityRecord = successPostToSlack.json.text.substring(0, 53);
	t.is(activityRecord, 'Here is a list of all recognized business activities.');
});

test('new test', async t => {
	// let's set the system variable for google spreadsheet url
	process.env.SPREADSHEET_ID = 'TEST_SPREADSHEET_ID';
	const successPostToSlack = await timeTrack.spreadsheetURL('http://example.com');
	const activityRecord = successPostToSlack.json.text;
	t.is(activityRecord, 'https://docs.google.com/spreadsheets/d/TEST_SPREADSHEET_ID/edit#gid=0');
});

test('new test', async t => {
	const successPostToSlack = await timeTrack.getHelp('http://example.com');
	const activityRecord = successPostToSlack.json.text.substring(0, 19);
	t.is(activityRecord, '*Time track usage:*');
});
