const error5OOHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: 'Something went wrong!!',
  });
};

const error4O4Handler = (req, res) => {
  res.status(404).send({
    success: false,
    message: 'the page you are looking for cannot be found',
  });
};

export { error5OOHandler, error4O4Handler };
