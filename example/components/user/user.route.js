const express = require('express');
const userController = require('./user.controller');

class UserRoute {
  initRoutes() {

  }

  constructor() {
    const router = express.Router();
    console.log('--------userController', userController);

    router.get('/:id', userController.get);

    return router;
  }
}

module.exports = new UserRoute();
