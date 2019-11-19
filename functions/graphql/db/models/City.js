const mongoose = require('mongoose');
const { Schema } = mongoose;

const citySchema = new Schema({
	city: String,
	state: String,
	country: String
});

module.exports = mongoose.model('cities', citySchema);
