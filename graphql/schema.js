import _ from 'lodash';
import schema from './schema.graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import resolversMongo from './resolvers/index.js';
import resolversProjection from './projection/index.js';

export default makeExecutableSchema({
	typeDefs: schema,
	resolvers: _.merge(resolversMongo, resolversProjection),
});
