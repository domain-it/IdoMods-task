import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../model/user.js';
import { LogError, LogInfo } from '../utils/color-log.js';
import jwt from 'jsonwebtoken';
import { emailValidation, passwordValidation } from '../utils/validation.js';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!emailValidation(email))
    return res.status(403).send({ message: 'Email is not valid' });
  if (!passwordValidation(password))
    return res.status(403).send({
      message: 'The password does not follow the secure password guidelines',
    });
  if (!email || !password)
    return res.status(400).json({ message: 'email and password is required' });
  const duplicate = await User.findOne({ email });
  if (duplicate)
    return res.status(409).json({ message: 'User already exists' });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };
    const createdUser = new User(newUser);
    await createdUser.save();
    LogInfo('Auth', `User has been registered`);
    res.status(201).json({ message: 'Successfully registered' });
  } catch (error) {
    LogError('Auth', `Error: ${error}`);
    res.status(400).send(error);
  }
};

export const authorization = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!emailValidation(email))
    return res.status(403).send({ message: 'Email is invalid' });
  if (!passwordValidation(password))
    return res.status(403).send({ message: 'Wrong password' });
  if (!email || !password)
    return res.status(401).json({ message: 'Email and password is required' });
  const foundUser = await User.findOne({ email });
  if (!foundUser) return res.status(401);
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { email: foundUser.email },
      accessTokenSecret,
      { expiresIn: '10M' }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      refreshTokenSecret,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
    return res.status(200).json({ message: 'Logged in successfully' });
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) return res.sendStatus(403);
  jwt.verify(refreshToken, refreshTokenSecret, (error: any, decoded: any) => {
    if (error) return res.status(401).json({ error: 'Unauthorized' });
    const accessToken = jwt.sign({ email: decoded }, refreshTokenSecret, {
      expiresIn: '1d',
    });
    res.json({ accessToken, decoded });
  });
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.refreshToken;
  if (refreshToken) return res.sendStatus(204);

  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie('refreshToken', { httpOnly: true });
    return res.sendStatus(204);
  }
  foundUser.refreshToken = null;
  await foundUser.save();
  res.clearCookie('refreshToken', { httpOnly: true });
};
