const test = require('ava').test;
const durationParser = require('../../lib/parsers/duration.js');

test('identify durations', t => {
	// test mm:ss format
	t.deepEqual(durationParser.identifyDuration('10:00'), {valid: true, type: 'mm:ss'});
	t.deepEqual(durationParser.identifyDuration('00:00'), {valid: true, type: 'mm:ss'});
	t.deepEqual(durationParser.identifyDuration('59:59'), {valid: true, type: 'mm:ss'});
	t.deepEqual(durationParser.identifyDuration('59:60'), {valid: false, type: 'mm:ss'});
	t.deepEqual(durationParser.identifyDuration('60:59'), {valid: false, type: 'mm:ss'});
	t.deepEqual(durationParser.identifyDuration(':'), {valid: false, type: 'mm:ss'});
	t.deepEqual(durationParser.identifyDuration('10:x'), {valid: false, type: 'mm:ss'});
	t.deepEqual(durationParser.identifyDuration(':10:x:'), {valid: false, type: '??:??'});

	// test hh:mm:ss format
	t.deepEqual(durationParser.identifyDuration('10:00:00'), {valid: true, type: 'hh:mm:ss'});
	t.deepEqual(durationParser.identifyDuration('24:59:59'), {valid: true, type: 'hh:mm:ss'});
	t.deepEqual(durationParser.identifyDuration('00:00:00'), {valid: true, type: 'hh:mm:ss'});
	t.deepEqual(durationParser.identifyDuration('25:59:59'), {valid: false, type: 'hh:mm:ss'});

	// test h/m/s formats
	t.deepEqual(durationParser.identifyDuration('12h'), {valid: true, type: 'h'});
	t.deepEqual(durationParser.identifyDuration('0h'), {valid: true, type: 'h'});
	t.deepEqual(durationParser.identifyDuration('h'), {valid: false, type: 'h'});

	t.deepEqual(durationParser.identifyDuration('12m'), {valid: true, type: 'm'});
	t.deepEqual(durationParser.identifyDuration('0m'), {valid: true, type: 'm'});
	t.deepEqual(durationParser.identifyDuration('m'), {valid: false, type: 'm'});

	t.deepEqual(durationParser.identifyDuration('12s'), {valid: true, type: 's'});
	t.deepEqual(durationParser.identifyDuration('0s'), {valid: true, type: 's'});
	t.deepEqual(durationParser.identifyDuration('s'), {valid: false, type: 's'});

	t.deepEqual(durationParser.identifyDuration('totally wrong'), {valid: false, type: '?'});
});

test('extract durations', t => {
	t.deepEqual(durationParser.extractDuration({type:'h', value: '1h'}), {hours:1, minutes:0, seconds:0});
	t.deepEqual(durationParser.extractDuration({type:'m', value: '10m'}), {hours:0, minutes:10, seconds:0});
	t.deepEqual(durationParser.extractDuration({type:'s', value: '1001s'}), {hours:0, minutes:0, seconds:1001});
	t.deepEqual(durationParser.extractDuration({type:'hh:mm:ss', value: '12:30:42'}), {hours:12, minutes:30, seconds:42});
	t.deepEqual(durationParser.extractDuration({type:'mm:ss', value: '30:42'}), {hours:0, minutes:30, seconds:42});
	t.throws(function() {
		durationParser.extractDuration({type:'invalid', value:''});
	});
});

test('calculate durations', t => {
	t.is(durationParser.calculateDurationInSeconds({hours:0,minutes:0,seconds:1}), 1);
	t.is(durationParser.calculateDurationInSeconds({hours:0,minutes:1,seconds:1}), 61);
	t.is(durationParser.calculateDurationInSeconds({hours:1,minutes:1,seconds:1}), 3661);
});
