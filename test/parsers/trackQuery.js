const test = require('ava').test;
const trackQueryParser = require('../../lib/parsers/trackQuery.js');

const sampleCommandBody = 'token=TOKENID&team_id=TEAMID&team_domain=DOMAIN&channel_id=CHANNELID&channel_name=directmessage&user_id=USERID&user_name=ersel&command=%2Ftrack&text=01234567+%22some+kind+of+activity%22+12m&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTK5K%2F15644%2FlRWL';

test('validate tracking info arguments length', t => {
	t.is(trackQueryParser.validateTrackingInfo(sampleCommandBody), true);
	t.throws(() => {
		trackQueryParser.getQueryVariable('nope', sampleCommandBody);
	}, Error);
});

test('extract tracking info', t => {
	t.deepEqual(trackQueryParser.extractTrackingInfo(sampleCommandBody), {companyNumber: '01234567', activity: 'some kind of activity', duration: '12m' });
});

test('extract supplementary info', t => {
	t.deepEqual(trackQueryParser.extractSupplementaryInfo(sampleCommandBody), {userName:'ersel', userId:'USERID', responseUrl:'https://hooks.slack.com/commands/TK5K/15644/lRWL'});
});
