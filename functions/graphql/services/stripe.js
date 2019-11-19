const stripe = require('stripe')('sk_test_j8CC9X3ntUoRz1lE6wyNHMst00C3W5vXca');

module.exports = {
	async createCustomer(token, email) {
		const customer = await stripe.customers.create({
			source: token,
			email
		});
	},

	async chargeCustomer(amount, currency, customer) {
		const charge = await stripe.charges.create({
			amount, // in cents !!!!
			currency: 'usd',
			customer: customer.id
		});
	}
};
