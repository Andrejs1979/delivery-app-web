const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const keys = require('../config/keys');

const client = redis.createClient(keys.redisURI);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
	this.useCache = true;
	this.hashKey = JSON.stringify(options.key || '');
	return this;
};

mongoose.Query.prototype.exec = async function() {
	if (!this.useCache) return exec.apply(this, arguments);

	const key = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name
		})
	);

	// check for data in Redis
	const cachedData = await client.hget(this.hashKey, key);

	//if true return it
	if (cachedData) {
		const doc = JSON.parse(cachedData);
		return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
	}

	// otherwise query Mongo and cache the data
	const data = await exec.apply(this, arguments);
	client.hset(this.hashKey, key, JSON.stringify(data), 'EX', 60);
	return data;
};

module.exports = {
	clearCache(hashKey) {
		client.del(JSON.stringify(hashKey));
	}
};
