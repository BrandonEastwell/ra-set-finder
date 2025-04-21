const express = require("express");
const { searchController } = require('../controllers/searchController');
const searchRouter = express.Router();

searchRouter.get("/", searchController)

module.exports = searchRouter