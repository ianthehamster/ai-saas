const express = require('express');
const router = express.Router();

class UsersRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get('/', this.controller.getAll.bind(this.controller));
    router.post('/', this.controller.postNewUser.bind(this.controller));
    router.delete('/:userId', this.controller.deleteOne.bind(this.controller));
    router.get(
      '/email',
      this.controller.getUserBasedOnEmail.bind(this.controller),
    );

    return router;
  }
}

module.exports = UsersRouter;
