import Cors from 'micro-cors';
import { ApolloServer } from 'apollo-server-micro';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import responseCachePlugin from 'apollo-server-plugin-response-cache';

import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';

import schema from '../../graphql/schema.js';
import models from '../../database/models/index.js';
import connect from '../../database/client.js';

import { getUserId } from '../../libs/auth.js';

const REDIS_URL = process.env.REDIS_URL;

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
	csrfPrevention: true,
  cache: new KeyvAdapter(new Keyv(REDIS_URL), {
		disableBatchReads: true,
	}),
	introspection: true,
	plugins: [
		ApolloServerPluginLandingPageGraphQLPlayground({
			endpoint: '/api/graphql',
		}),
		responseCachePlugin({
	    sessionId: ({ request: { http: { headers } } }) => {
				const session = headers.get('authorization');
				return session ? session.split(' ')[1] : null;
			},
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
