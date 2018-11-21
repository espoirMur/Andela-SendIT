import { Router } from 'express';
import bodyParser from 'body-parser';
import { users, User } from '../models/user';
import { registerSchema, loginSchema } from '../models/userSchemas';
import { celebrate } from 'celebrate';
import { encodeToken, decodeToken } from '../utils/authentification';

const authRouter = Router();

//
authRouter.post('/signup', celebrate({ body: registerSchema }), (req, res) => {
  // load user details from body
  //  check if the email is already taken and return an error if
  const { name, email, phone, password } = req.body;

  const exist = User.findByEmail(email);
  if (exist !== false) {
    const user = new User(name, email, phone, password);
    const userId = user.save();
    const token = encodeToken(user.toJSON());
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

authRouter.post(
  '/signin',
  celebrate({ body: loginSchema }),
  (req, res, next) => {
    const { email, password } = req.body;
    const user = User.findByEmail(email);
    if (user) {
      console.log(user);
      const validpassword = user.verifyPassword();
      if (validpassword) {
        const token = encodeToken(user.toJSON());
        res.status(200).send({
          token: token,
          success: true,
          userId: user.id,
        });
      } else {
        res.status(401).send({
          success: false,
          message: 'Invalid credentials',
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: 'User not found , please create an account',
      });
    }
  }
);

export default authRouter;
