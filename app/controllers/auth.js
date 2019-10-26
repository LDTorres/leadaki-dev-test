const utils = require('../middleware/utils')

/**
 * Checks if is present token and if is valid
 * @param {Object} req - req object
 * @param {Object} res - res object
 * @param {*} next - next callback
 */
exports.validateToken = (req, res, next) => {
  try {
    if (!req.headers.token) {
      throw { message: 'TOKEN_NOT_PRESENT', code: '401' }
    }

    if (req.headers.token == '123456789') {
      return next()
    }
    throw { message: 'TOKEN_NOT_VALID', code: '401' }
  } catch (err) {
    console.log(err.message)

    return utils.handleError(res, err)
  }
}
