import { Router } from 'express';
import bodyParser from 'body-parser';
import { users, User } from '../models/user';
import { userSchema } from '../models/userSchemas';
import { celebrate } from 'celebrate';
import { encodeToken, decodeToken } from '../utils/authentification';

const authRouter = Router();

//celebrate({  body: userSchema,})
authRouter.post('/signup', (req, res) => {
  // load user details from body
  //  check if the email is already taken and return an error if
  const { name, email, phone, password } = req.body;
  const user = new User(name, email, phone, password);
  const userId = user.save();
  const token = encodeToken(user.toJSON());
  return res.status(201).send({
    success: true,
    message: 'the new user has been created',
    userId: userId,
    token,
  });
});

export default authRouter;
