const BaseController = require('./baseController');
require('dotenv').config();

class ChatsController extends BaseController {
  constructor(model) {
    super(model);
  }

  async postNewChat(req, res) {
    const { chat_contents, user_id } = req.body;

    try {
      const newChat = await this.model.create({
        chat_contents,
        user_id,
      });

      return res.json(newChat);
    } catch (err) {
      console.error(err);
    }
  }

  async getChat(req, res) {
    const { chatId } = req.params;

    const chat = await this.model.findByPk(chatId);

    return res.send(chat);
  }

  async deleteChat(req, res) {
    const { chatId } = req.params;
    try {
      await this.model.destroy({
        where: {
          id: chatId,
        },
      });

      res.status(200).send(`Successfully deleted chat${chatId}`);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
  }

  // async getUserBasedOnEmail(req, res) {
  //   const { email } = req.body;

  //   try {
  //     const targetUser = await this.model.findOne({
  //       where: { email: email },
  //     });

  //     console.log(targetUser);

  //     return res.json(targetUser);
  //   } catch (err) {
  //     console.log(err.message);
  //     return res.status(400).json({ error: true, msg: err.message });
  //   }
  // }

  // async deleteOne(req, res) {
  //   const { userId } = req.params;

  //   try {
  //     await this.model.destroy({
  //       where: {
  //         id: userId,
  //       },
  //     });

  //     res.status(200).send(`Successfully deleted user at user id: ${userId}`);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(400).send({ error: true, msg: error });
  //   }
  // }
}
module.exports = ChatsController;