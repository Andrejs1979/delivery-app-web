const Consumer = require('../db/models/Consumer');
const payment = require('payment');

module.exports = (paymentProps) => {
	const { card, expMM, expYYYY, cvc } = paymentProps;

	const exp = `${expMM}/${expYYYY}`;

	const isValidNumber = true;
	// const isValidNumber = payment.fns.validateCardNumber(card);
	const isValidExpiry = payment.fns.validateCardExpiry(exp);
	const isValidCVC = payment.fns.validateCardCVC(cvc);

	if (isValidNumber && isValidExpiry && isValidCVC) {
		const number = card.replace(/\s+/g, '');
		return {
			isValidCard: true,
			campaign: payment.fns.cardType(card),
			card: number,
			bin: number.slice(0, 8),
			last4: number.slice(-4),
			expMM: expMM,
			expYY: expYYYY.slice(-2),
			cvc: cvc
		};
	} else {
		return { isValidCard: false };
	}
};
