import { Joi } from 'celebrate';

const userSchema = {
  name: Joi.string().required(),
  password: Joi.string().min(6),
  email: Joi.string()
    .email()
    .required(),
};

export default userSchema;
