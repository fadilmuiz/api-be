const handleClientError = (res, status, message) => {
  return res.status(status).json({ message });
};

const handleServerError = (res) => {
  return res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = {
  handleClientError,
  handleServerError
}