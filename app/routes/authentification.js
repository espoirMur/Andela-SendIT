import { Router } from 'express';
import bodyParser from 'body-parser';
import { users, User } from '../models/user';
import { registerSchema, loginSchema } from '../models/userSchemas';
import { celebrate } from 'celebrate';
import { encodeToken, decodeToken } from '../utils/authentification';

const authRouter = Router();

//
authRouter.post(
  '/signup',
  celebrate({ body: registerSchema }),
  async (req, res) => {
    // load user details from body
    //  check if the email is already taken and return an error if
    const { name, email, phone, password } = req.body;

    //const exist = User.findByEmail(email);
    const user = new User(name, email, phone, password);
    await user
      .save()
      .then(result => {
        const token = encodeToken(result);
        return res.status(201).send({
          success: true,
          message: 'the new user has been created',
          userId: result.id,
          token,
        });
      })
      .catch(error => {
        if (error.code === '23505' && error.constraint === 'users_email_key') {
          // 23505 means duplicate key entry and constraint is to show if the email is taken
          return res.status(409).send({
            success: false,
            message: 'the email is already taken , try to login',
          });
        } else {
          return res.status(500).send({
            success: false,
            message: 'something please try again',
          });
        }
      });
  }
);

authRouter.post(
  '/signin',
  celebrate({ body: loginSchema }),
  (req, res, next) => {
    const { email, password } = req.body;
    const user = User.findByEmail(email);
    if (user) {
      const validpassword = User.verifyPassword(user, password);
      if (validpassword) {
        const token = encodeToken(user);
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
