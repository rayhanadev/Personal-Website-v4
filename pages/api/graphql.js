import Cors from 'micro-cors';
import { ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import schema from '../../graphql/schema.js';
import models from '../../database/models/index.js';
import connect from '../../database/client.js';

import { getUserId } from '../../libs/auth.js';

const cors = Cors();

const apolloServer = new ApolloServer({
	schema,
	context: ({ req }) => {
		return {
			...req,
			models,
			userId: req && req.headers.authorization ? getUserId(req) : null,
		};
	},
	introspection: true,
	plugins: [
		ApolloServerPluginLandingPageGraphQLPlayground({
			endpoint: '/api/graphql',
		}),
	],
});

const startDatabase = connect();
const startServer = apolloServer.start();

const resolver = cors(async (req, res) => {
	if (req.method === 'OPTIONS') {
		res.end();
		return false;
	}

	await startDatabase;
	await startServer;
	await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});

export default resolver;

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};