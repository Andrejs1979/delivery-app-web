'use strict';
const _ = require('lodash');
const keygen = require('keygen');
const axios = require('axios');

const Account = require('../models/Account');
// const sendGrid = require('../../services/sendGrid');

const keys = require('../../config/keys');
// const PaymentsController = require('./payments_controller');

const updateZapierURI = 'https://hooks.zapier.com/hooks/catch/2137404/gpr988/silent/';
// const createZapierURI =
//   "https://hooks.zapier.com/hooks/catch/2137404/gwv9at/silent/";

const createZapierURI = 'https://hooks.zapier.com/hooks/catch/2137404/emg1vi/silent/';

module.exports = {
	async findByToken(token) {
		let account;
		account = await Account.findOne({
			'users.uid': token
		});

		if (account) return account;

		account = await Account.findOne({
			apiKey: token
		});

		if (account) return account;
	},
	async findByUser(id, email) {
		let query = {};
		let accounts = [];

		if (id && id !== '') {
			query = {
				...query,
				...{
					'users.uid': id
				}
			};
		}

		if (email && email !== '') {
			query = {
				...query,
				...{
					'users.email': email
				}
			};
		}

		accounts = await Account.find(query);

		if (accounts.length > 0) {
			return accounts;
		} else if (id && id !== '' && (email && email !== '')) {
			const accountProps = {
				name: ''
			};

			const userProps = {
				uid: id,
				email
			};

			const account = this.create(accountProps, userProps);

			return [ account ];
		}
	},

	async create(accountProps, userProps) {
		try {
			const account = await Account.create(accountProps);

			return Account.findByIdAndUpdate(
				account,
				{
					key: keygen.url(),
					apiKey: keygen.url(keygen.large),
					$push: {
						users: {
							uid: userProps.uid,
							email: userProps.email
						}
					}
				},
				{
					new: true
				}
			);
		} catch (err) {
			console.log(err);
		}
	},

	async update(userProps) {
		try {
			return Account.findOneAndUpdate(
				{ 'users.uid': userProps.uid },
				{
					$set: {
						'users.$.firstName': userProps.firstName,
						'users.$.lastName': userProps.lastName,
						'users.$.phone': userProps.phone,
						'users.$.avatar': userProps.avatar
					}
				},
				{
					new: true
				}
			);
		} catch (err) {
			console.log(err);
		}
	}
};
