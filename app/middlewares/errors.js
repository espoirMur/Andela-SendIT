import { isCelebrate } from 'celebrate';
const error5OOHandler = (err, req, res, next) => {
  // next need to be here it's failling in productiion
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: 'Something went wrong!!',
  });
};

const error4O4Handler = (req, res) => {
  res.status(404).send({
    success: false,
    message: 'The page you are looking for cannot be found',
  });
};

const joiErrors = () => (err, req, res, next) => {
  if (!isCelebrate(err)) return next(err);
  return res.status(400).json({
    success: false,
    message: err.message,
  });
};

export { error5OOHandler, error4O4Handler, joiErrors };
