import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';

import { project } from '../projection/index.js';

const nanoid = customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 10);

function validateUser(user) {
	const schema = Joi.object({
		username: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
	});

	return schema.validate(user);
}

export async function signup(parent, args, context, info) {
	const { error } = validateUser(args);
	if (error) {
		return { message: String(error.details[0].message) };
	}

	if ((await context.models.User.findOne({ email: args.email })) !== null) {
		return { message: 'User with that email address already exists.' };
	}

	const password = await bcrypt.hash(args.password, 10);
	const user = await context.models.User.create({
		_id: nanoid(),
		...args,
		password,
	});

	const token = jwt.sign(
		{ userId: user._id },
		process.env.JWT_SIGNING_SECRET,
	);

	return { token, user };
}

export async function login(parent, { username, password }, context, info) {
	const user = await context.models.User.findOne({ username });
	if (!user) return { message: `Invalid username or password.` };

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return { message: `Invalid username or password.` };

	const token = jwt.sign(
		{ userId: user._id },
		process.env.JWT_SIGNING_SECRET,
	);

	return { token, user };
}
