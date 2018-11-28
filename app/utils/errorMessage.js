const error500Message = (error, res) => {
  console.error(error);
  return res.status(500).send({
    success: false,
    message: 'Something went wong please try again',
  });
};

export default error500Message;
