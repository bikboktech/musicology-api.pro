const handleError = (error, request, response, next) => {
  console.error(error);

  return response.status(error.status).send(error.message);
};

export default handleError;
