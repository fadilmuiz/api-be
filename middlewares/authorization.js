const { User } = require('../models/index')
const { handleClientError, handleServerError } = require('../helpers/errorHandler')


const authorization = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.additionalData.userId }
    })
    if (!user) {
      return handleClientError(res, 404, 'User not found');
    }

    if (user.role.toLowerCase() === "admin") {
      next()
    } else {
      return handleClientError(res, 403, "Access refused")
    }
  } catch (err) {
    handleServerError(res)
  }
}
module.exports = authorization