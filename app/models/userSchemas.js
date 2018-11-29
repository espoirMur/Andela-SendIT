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
    .regex(/^[0]{1}[7]{1}[8, 3, 2]{1}[0-9]{7}/)
    .required()
    .error(
      new Error(
        'Please enter a valid phone number , staring with 078, 072 or 073',
      ),
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
