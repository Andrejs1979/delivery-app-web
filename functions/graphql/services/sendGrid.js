const sgMail = require('@sendgrid/mail');
const mongoose = require('mongoose');

const { sendGridKey } = require('../config/keys');
const Consumer = mongoose.model('consumers');
const Campaign = mongoose.model('campaigns');
const User = mongoose.model('users');

sgMail.setApiKey(sendGridKey);

module.exports = {
	async sendInvoice(invoiceProps, invoiceID) {
		const { consumer, merchant, amount, currency, taxRate, tax, dueDate, total, items } = invoiceProps;

		const { firstName, lastName, email } = await Consumer.findById(consumer);
		const { name, url, key, address } = await Campaign.findById(merchant);

		const msg = {
			to: email,
			from: 'Payment.Ninja@payment.ninja',
			templateId: 'd-b038a5792d9e4277b8692290dbc47638',
			dynamic_template_data: {
				invoice: invoiceID,
				merchant: name,
				merchantKey: key,
				merchantURL: url,
				merchantAddress: address,
				firstName,
				lastName,
				items,
				dueDate,
				total: Number(total).toFixed(2),
				tax: Number(tax).toFixed(2),
				amount: Number(amount).toFixed(2),
				currency
			}
		};

		try {
			sgMail.send(msg);
		} catch (e) {
			console.log(e);
		}
	},

	async sendReciept(paymentProps) {
		const { email, name, amount, currency, campaign, last4 } = paymentProps;

		// const { firstName, lastName, email } = await Consumer.findById(consumer);
		// const { name, url, key, address } = await Campaign.findById(merchant);

		const msg = {
			to: email,
			from: 'Payment.Ninja@payment.ninja',
			templateId: 'd-2f0652171ec04089a13dc8619f350835',
			dynamic_template_data: {
				merchant: name,
				amount: Number(amount).toFixed(2),
				currency,
				campaign,
				last4
				// merchantURL: url,
				// merchantAddress: address,
				// firstName,
				// lastName
			}
		};

		try {
			sgMail.send(msg);
		} catch (e) {
			console.log(e);
		}
	}

	// async sendCampaignAlert(paymentProps, merchant) {
	//   const { name, amount, currency, campaign, last4 } = paymentProps;
	//
	//   const { firstname, lastname, email } = await User.findById(merchant._user);
	//
	//   const msg = {
	//     to: email,
	//     from: "alerts@payment.ninja",
	//     templateId: "d-7c3d7407e38e4f3abc663eda8a8d9613",
	//     dynamic_template_data: {
	//       merchant: name,
	//       amount: Number(amount).toFixed(2),
	//       currency,
	//       campaign,
	//       last4
	//       // merchantURL: url,
	//       // merchantAddress: address,
	//       // firstName,
	//       // lastName
	//     }
	//   };
	//
	//   try {
	//     sgMail.send(msg);
	//   } catch (e) {
	//     console.log(e);
	//   }
	// }
};
