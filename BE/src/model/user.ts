import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  accessToken: { type: String },
  refreshToken: { type: String },
});

export const User = model('User', UserSchema);
