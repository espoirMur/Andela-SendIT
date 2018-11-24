import { Joi } from 'celebrate';

const createOrder = {
  origin: Joi.string()
    .required()
    .error(new Error('pickup location is required')),
  destination: Joi.string()
    .required()
    .error(new Error('destination is required')),
  recipientPhone: Joi.string()
    .required()
    .error(new Error('recipient phone is required')),
  comments: Joi.string(),
};

export { createOrder };
