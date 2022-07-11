import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
	_id: String,
	username: String,
	password: String,
	email: String,
});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;
