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

  const exist = User.findByEmail('1');
  const user = new User(name, email, phone, password);
  const userId = user.save();
  const token = encodeToken(user.toJSON());

  if (!exist) {
    return res.status(201).send({
      success: true,
      message: 'the new user has been created',
      userId: userId,
      token,
    });
  } else {
    // 409 mean code duplicate data
    return res.status(409).send({
      success: false,
      message: 'the email is already taken , try to login',
    });
  }
});

export default authRouter;
