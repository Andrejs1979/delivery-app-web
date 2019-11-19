const { ApolloServer } = require('apollo-server-lambda');
const responseCachePlugin = require('apollo-server-plugin-response-cache');
const mongoose = require('mongoose');
// const Raven = require('raven');

const keys = require('./config/keys');
const models = require('./db/models');
const { Accounts } = require('./db/controllers');

require('./services/cache');

const schema = require('./graphql/schema');

// Raven.config('https://e1101278e6a64627bac696d1f7285f49:bd83a46333bf4665987d853a6374cafb@sentry.io/1445821').install();

mongoose.Promise = global.Promise;
// Connect to production DB
if (process.env.NODE_ENV !== 'test') {
	mongoose.connect(keys.mongoURI, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true
	});
	mongoose.connection
		.once('open', () => console.log('Connected to MongoDB instance.'))
		.on('error', (error) => console.log('Error connecting to MongoDB:', error));
}

const server = new ApolloServer({
	schema,
	plugins: [ responseCachePlugin() ],
	context: async ({ event, context }) => {
		const auth = event.headers.authorization || '';
		const token = auth.slice(7);
		const account = await Accounts.findByToken(token);

		return {
			token,
			account
		};
	},
	tracing: process.env.NODE_ENV !== 'production',
	cacheControl: true
});

exports.handler = server.createHandler();
