import { Joi } from 'celebrate';

const registerSchema = {
  name: Joi.string()
    .required()
    .error(new Error('Please provide a valid name')),
  password: Joi.string()
    .min(6)
    .error(new Error('The password should have at least 7 characters')),
  email: Joi.string()
    .email()
    .required()
    .error(new Error('Please provide a valid email')),
  phone: Joi.string()
    .min(10)
    .max(15)
    .required()
    .error(
      new Error('Invalid phone number , please put a number staring with +250'),
    ),
};

const loginSchema = {
  email: Joi.string()
    .email()
    .required()
    .error(new Error('Please provide a valid email')),
  password: Joi.string()
    .min(6)
    .error(new Error('The password should have at least 7 characters')),
};

export { registerSchema, loginSchema };
