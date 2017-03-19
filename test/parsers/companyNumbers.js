const test = require('ava').test;
const companyNumberParser = require('../../lib/parsers/companyNumber.js');

test('Validate company numbers', t => {
	const validNumbers = [
		'NI027971',
		'SC089169',
		'OC027971',
		'R0027971',
		'SO027971',
		'NC027971',
		'12345678'
	];

	const invalidNumbers = [
		'01234',
		'NI027971B',
		'SC0899169',
		'OC02X7971',
		'R007971',
		'SO027971A',
		'N1027971',
		'123456789'
	];

	// check valid numbers
	for(let i = 0; i < validNumbers.length; i++){
		t.is(companyNumberParser.validateCompanyNumber(validNumbers[i]), true);
	}

	for(let i = 0; i < invalidNumbers.length; i++){
		t.is(companyNumberParser.validateCompanyNumber(invalidNumbers[i]), false);
	}
});
