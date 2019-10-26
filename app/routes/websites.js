const controller = require('../controllers/websites')
const validate = require('../controllers/websites.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()

const trimRequest = require('trim-request')

/*
 * Websites routes
 */

/*
 * Get all items route
 */
router.get('/all', AuthController.validateToken, controller.getAllItems)

/*
 * Get items route
 */
router.get(
  '/',
  AuthController.validateToken,
  trimRequest.all,
  controller.getItems
)

/*
 * Create new item route
 */
router.post(
  '/',
  AuthController.validateToken,
  trimRequest.all,
  validate.createItem,
  controller.createItem
)

/*
 * Get item route
 */
router.get(
  '/:id',
  AuthController.validateToken,
  trimRequest.all,
  validate.getItem,
  controller.getItem
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  AuthController.validateToken,
  trimRequest.all,
  validate.updateItem,
  controller.updateItem
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  AuthController.validateToken,
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

module.exports = router
