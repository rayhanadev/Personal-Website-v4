export function __resolveType(obj) {
	if (obj.token) return 'Auth';
	if (obj.message) return 'UserError';

	return null;
}
