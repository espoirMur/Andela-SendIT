import { Joi } from 'celebrate';

const createOrder = {
  origin: Joi.string()
    .required()
    .error(new Error('Pickup location is required')),
  destination: Joi.string()
    .required()
    .error(new Error('Destination is required')),
  recipientPhone: Joi.string()
    .required()
    .error(new Error('Recipient phone is required')),
  comments: Joi.string(),
};

const updateDestination = {
  destination: Joi.string()
    .required()
    .error(new Error('Destination is required')),
};

const updateStatus = {
  status: Joi.string()
    .required()
    .error(new Error('New status is required')),
  weight: Joi.number(),
};

const updateLocation = {
  location: Joi.string()
    .required()
    .error(new Error('Present location is required')),
};

const orderId = {
  id: Joi.string()
    .required()
    .error(new Error('Invalid parameter')),
};
export {
  createOrder,
  updateDestination,
  orderId,
  updateStatus,
  updateLocation,
};
