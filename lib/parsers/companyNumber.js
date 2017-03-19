'use strict';

const companyNumberRegexEnglandAndWales = /^[0-9]{8}$/;
const companyNumberRegex =  /^[NI|R0|SC|OC|SO|NC]{2}[0-9]{6}$/;

const parser = {

	validateCompanyNumber(companyNumber) {
		// determine which regex to use
		// check if the first char is a letter
		companyNumber = companyNumber.trim().toUpperCase();
		if (isNaN(companyNumber.charAt(0))) {
			return companyNumberRegex.test(companyNumber);
		} else {
			return companyNumberRegexEnglandAndWales.test(companyNumber);
		}
	}

};

module.exports = parser;
