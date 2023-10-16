export const setCookie = (cookieName, cookieValue, daysToExpire) => {
	// TODO neden 365 yerine 7 gün set ediyor?
	const date = new Date();
	date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
	document.cookie = `${cookieName} = ${cookieValue}; expires = ${date.toUTCString()}`;
};

export const getCookie = (cookieName) => {
	const cookieNameString = `${cookieName}=`;

	const cookie = document.cookie.split(';').filter((item) => {
		return item.trim().includes(cookieNameString);
	});

	if (cookie.length) {
		return cookie[0]
			.trim()
			.substring(cookieNameString.length, cookie[0].length);
	}
	return null;
};

export const getCityName = (cityId) => {
	const cityArray = [
		{ id: '82', name: 'Online' },
		{ id: '0', name: 'Türkiye' },
		{ id: '6', name: 'Ankara' },
		{ id: '34', name: 'İstanbul' },
		{ id: '35', name: 'İzmir' },
	];
	let cityName = 'Türkiye';
	cityArray.map((city) => {
		if (city.id === cityId) {
			cityName = city.name;
			return true;
		}
		return false;
	});
	return cityName;
};

// This method checks to see if the validity of all validators are true
export const isFormValid = (validators) => {
	let status = true;
	Object.keys(validators).forEach((field) => {
		if (!validators[field].valid) {
			status = false;
		}
	});
	return status;
};

// This function resets all validators for this form to the default state
export const resetValidators = (validators) => {
	Object.keys(validators).forEach((fieldName) => {
		validators[fieldName].errors = [];
		validators[fieldName].state = '';
		validators[fieldName].valid = false;
	});
};

// This function updates the state of the validator for the specified validator
export const updateValidators = (
	validators,
	fieldName,
	value,
	compareValue
) => {
	validators[fieldName].errors = [];
	validators[fieldName].state = value;
	validators[fieldName].valid = true;
	validators[fieldName].rules.forEach((rule) => {
		if (rule.test instanceof RegExp) {
			if (!rule.test.test(value)) {
				validators[fieldName].errors.push(rule.message);
				validators[fieldName].valid = false;
			}
		} else if (typeof rule.test === 'function') {
			if (!rule.test(value, compareValue)) {
				validators[fieldName].errors.push(rule.message);
				validators[fieldName].valid = false;
			}
		}
	});
	return validators;
};
