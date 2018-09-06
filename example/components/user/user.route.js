const express = require('express');
const userController = require('./user.controller');

class UserRoute {
  constructor() {
    const router = express.Router({ mergeParams: true });
    console.log('--------userController.get', userController.get);

    // router.get('/:id', userController.get);
    router.get('/:id', (req, res, next) => {
      const a = 1;
      const b = 1;
    });

    return router;
  }
}

module.exports = new UserRoute();
