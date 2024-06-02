const BaseController = require('./baseController');
require('dotenv').config();

class UsersController extends BaseController {
  constructor(model) {
    super(model);
  }

  async postNewUser(req, res) {
    const { first_name, last_name, email } = req.body;
    try {
      const newUser = await this.model.create({
        first_name,
        last_name,
        email,
      });
      return res.json(newUser);
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async deleteOne(req, res) {
    const { userId } = req.params;

    try {
      await this.model.destroy({
        where: {
          id: userId,
        },
      });

      res.status(200).send(`Successfully deleted user at user id: ${userId}`);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
  }
}
module.exports = UsersController;
