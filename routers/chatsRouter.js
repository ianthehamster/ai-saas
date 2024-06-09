const express = require('express');
const router = express.Router();

class ChatsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get('/', this.controller.getAll.bind(this.controller));
    router.post('/', this.controller.postNewChat.bind(this.controller));
    router.get('/:chatId', this.controller.getChat.bind(this.controller));
    router.delete('/:chatId', this.controller.deleteChat.bind(this.controller));

    return router;
  }
}

module.exports = ChatsRouter;
