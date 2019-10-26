const model = require('../models/website')
const { matchedData } = require('express-validator')
const utils = require('../middleware/utils')
const db = require('../middleware/db')

/*********************
 * Private functions *
 *********************/

/**
 * Checks if a website already exists excluding itself
 * @param {string} id - id of item
 * @param {string} name - name of item
 */
const websiteExistsExcludingItself = async (id, name) => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        _id: {
          $ne: id
        }
      },
      (err, item) => {
        utils.itemAlreadyExists(err, item, reject, 'WEBSITE_ALREADY_EXISTS')
        resolve(false)
      }
    )
  })
}

/**
 * Checks if a website already exists in database
 * @param {string} name - name of item
 */
const websiteExists = async name => {
  return new Promise((resolve, reject) => {
    model.findOne({ domain: name }, (err, item) => {
      utils.itemAlreadyExists(err, item, reject, 'WEBSITE_ALREADY_EXISTS')
      resolve(false)
    })
  })
}

/**
 * Gets all items from database
 */
const getAllItemsFromDB = async () => {
  return new Promise((resolve, reject) => {
    model.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          domain: 1
        }
      },
      (err, items) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        resolve(items)
      }
    )
  })
}

/********************
 * Public functions *
 ********************/

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getAllItems = async (req, res) => {
  try {
    res.status(200).json(await getAllItemsFromDB())
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItems = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query)
    res.status(200).json(await db.getItems(req, model, query))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.getItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    const website = new model({
      id: req.body.id,
      domain: req.body.domain,
      ownerId: req.body.ownerId,
      leadCount: req.body.leadCount,
      plan: req.body.plan,
      labels: req.body.labels
    })

    const id = await utils.isIDGood(website.id)
    const doesWebsiteExists = await websiteExistsExcludingItself(
      id,
      website.domain
    )
    if (!doesWebsiteExists) {
      res.status(200).json(await db.updateItem(id, model, website))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    const website = new model({
      domain: req.body.domain,
      ownerId: req.body.ownerId,
      leadCount: req.body.leadCount,
      plan: req.body.plan,
      labels: req.body.labels
    })

    const doesWebsiteExists = await websiteExists(website.domain)
    if (!doesWebsiteExists) {
      res.status(201).json(await db.createItem(website, model))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
