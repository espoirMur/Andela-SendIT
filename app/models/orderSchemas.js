import { Joi } from 'celebrate';

const createOrder = {
  origin: Joi.string()
    .required()
    .error(new Error('Pickup location is required')),
  destination: Joi.string()
    .required()
    .error(new Error('Destination is required')),
  recipientPhone: Joi.string()
    .regex(/^[0]{1}[7]{1}[8, 3, 2]{1}[0-9]{7}/)
    .required()
    .error(
      new Error(
        'Please enter a valid phone number , staring with 078, 072 or 073',
      ),
    ),

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
