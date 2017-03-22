const test = require('ava').test;
const timeTrack = require('../lib/timeTrack.js');

test('time track interface', async t => {
	let event = 'token=TOKENID&team_id=TEAMID&team_domain=DOMAIN&channel_id=CHANNELID&channel_name=directmessage&user_id=USERID&user_name=ersel&command=%2Ftrack&text=09205274+%22some+kind+of+activity%22+12m&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTK5K%2F15644%2FlRWL';
	t.is(await timeTrack.track(event, 'http://example.com'), 'Recorded time');
});

test('new test', async t => {
	t.is(await timeTrack.activityList('http://example.com'));
});

test('new test', async t => {
	t.is(await timeTrack.spreadsheetURL('http://example.com'));
});

test('new test', async t => {
	t.is(await timeTrack.getHelp('http://example.com'));
});
