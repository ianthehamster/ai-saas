const express = require('express');
const router = express.Router();

class APIsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get('/', this.controller.getAll.bind(this.controller));
    router.post('/', this.controller.createApiCount.bind(this.controller));
    router.put(
      '/:userId',
      this.controller.increaseApiCount.bind(this.controller),
    );
    router.put(
      '/reset/:userId',
      this.controller.resetApiCount.bind(this.controller),
    );
    router.get(
      '/users/:userId',
      this.controller.getApiCountByUserId.bind(this.controller),
    );
    router.get('/:apiId', this.controller.getApiCount.bind(this.controller));
    router.delete('/:apiId', this.controller.deleteApi.bind(this.controller));

    return router;
  }
}

module.exports = APIsRouter;
