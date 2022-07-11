import { project } from '../projection/index.js';

export async function currentUser(parent, args, context, info) {
	const proj = project(info);

	const result = await context.models.User.findById(context.userId, proj);
	return result?.toObject();
}
