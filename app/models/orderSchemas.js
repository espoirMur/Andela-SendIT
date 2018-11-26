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

const updateDestination = {
  destination: Joi.string()
    .required()
    .error(new Error('destination is required')),
};

const orderId = {
  id: Joi.number()
    .required()
    .error(new Error('Invalid parameter')),
};
export { createOrder, updateDestination, orderId };
