'use strict';
const _ = require('lodash');
const keygen = require('keygen');
const axios = require('axios');

const Account = require('../models/Account');
// const sendGrid = require('../../services/sendGrid');

const Campaigns = require('./campaigns_controller');

module.exports = {
	async createCard(cardProps, account) {
		const exists = await Account.exists({ 'cards.token': cardProps.token });

		if (!exists)
			try {
				return Account.findByIdAndUpdate(account, {
					$push: {
						cards: cardProps
					}
				});
			} catch (error) {
				console.log(error);
			}
	},

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

	async activate(accountProps) {
		const props = {
			status: 'pending',
			entity: {
				entity: accountProps.entity,
				type: accountProps.type,
				taxnumber: accountProps.taxid
			},
			address: accountProps.address,
			email: accountProps.email,
			phone: accountProps.phone,
			bankaccount: {
				account: accountProps.account,
				bic: accountProps.bic
			}
		};

		try {
			const account = await Account.findByIdAndUpdate(accountProps.id, props, {
				new: true
			});

			// axios.post(updateZapierURI, accountProps)
			return account;
		} catch (err) {
			console.log(err);
		}
	},

	onboard(accountProps) {
		try {
			return Account.findByIdAndUpdate(
				accountProps.id,
				{
					status: 'active',
					name: accountProps.name,
					category: accountProps.category,
					type: accountProps.type
				},
				{
					new: true
				}
			);
		} catch (err) {
			console.log(err);
		}
	},

	async update(accountProps) {
		const props = {
			status: accountProps.status || 'new',
			isLive: accountProps.isLive || false,
			plan: accountProps.plan || '',
			volume: accountProps.volume || '',
			ticket: accountProps.ticket || '',
			entity: {
				entity: accountProps.entity || '',
				type: accountProps.type || '',
				taxnumber: accountProps.taxid || ''
			},
			address: accountProps.address || '',
			email: accountProps.email || '',
			phone: accountProps.phone || '',
			bankaccount: {
				account: accountProps.account || '',
				bic: accountProps.bic || ''
			},
			owners: {
				firstname: accountProps.ownerFirstName || '',
				lastname: accountProps.ownerLastName || '',
				dob: accountProps.ownerDOB || '',
				address: accountProps.ownerAddress || ''
			}
		};

		try {
			const account = await Account.findByIdAndUpdate(accountProps.id, props, {
				new: true
			});

			axios.post(updateZapierURI, accountProps);
			return account;
		} catch (err) {
			console.log(err);
		}
	}
};
