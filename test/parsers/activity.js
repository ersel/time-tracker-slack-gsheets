const test = require('ava').test;
const activity = require('../../lib/parsers/activity.js');

const activityListSpreadSheet = [
	['onboarding call', 'onboarding, oc'],
	['risk assessment of the project', 'risk, ra']
];

const parsedActivityList = {
	'onboarding call': ['onboarding', 'oc'],
	'risk assessment of the project': ['risk', 'ra']
};

test('parse activity list from spreadsheet data', t => {
	t.deepEqual(activity.parseActivityListFromSpreadSheet(activityListSpreadSheet), parsedActivityList);
});

test('validate activity input', t => {
	t.deepEqual(activity.validateInput('onboarding call', parsedActivityList), {valid:true, activity:'onboarding call'});
	t.deepEqual(activity.validateInput('onboarding', parsedActivityList), {valid:true, activity:'onboarding call'});
	t.deepEqual(activity.validateInput('ra', parsedActivityList), {valid:true, activity:'risk assessment of the project'});
	t.deepEqual(activity.validateInput('onboardi', parsedActivityList), {valid:false, recommendations: ['onboarding', 'onboarding call']});
});

test('median calculation', t => {
	// https://en.wikipedia.org/wiki/Median#Basic_procedure
	t.is(activity.calculateMedian([1, 3, 3, 6, 7, 8, 9]), 6);
	t.is(activity.calculateMedian([1, 2, 3, 4, 5, 6, 8, 9]), 4.5);
});

test('first quartile calculation', t => {
	// http://web.mnstate.edu/peil/MDEV102/U4/S36/S363.html
	t.is(activity.calculateFirstQuartile([3, 5, 7, 8, 12, 13, 14, 18, 21]), 6);
});
