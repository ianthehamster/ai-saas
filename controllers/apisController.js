const BaseController = require('./baseController');
require('dotenv').config();

class APIsController extends BaseController {
  constructor(model) {
    super(model);
  }

  async createApiCount(req, res) {
    const { userId } = req.body;

    try {
      const newApiCount = await this.model.create({
        user_id: userId,
        count: 0,
      });

      return res.json(newApiCount);
    } catch (err) {
      console.error(err);
    }
  }

  async increaseApiCount(req, res) {
    // Get row corresponding to userId
    const { userId } = req.params;

    // Post a count of 1 to the current count of that row
    const desiredApi = await this.model.findOne({
      where: {
        userId,
      },
    });

    if (!desiredApi) {
      return res.status(404).send({ message: 'User not found' });
    }

    desiredApi.count += 1;
    await desiredApi.save();

    return res.json(desiredApi);
  }

  async getApiCount(req, res) {
    const { apiId } = req.params;

    const api = await this.model.findByPk(apiId);

    return res.send(api);
  }

  async getApiCountByUserId(req, res) {
    const { userId } = req.params;

    const desiredApiCount = await this.model.findOne({
      where: {
        userId,
      },
    });

    return res.json(desiredApiCount);
  }

  async resetApiCount(req, res) {
    const { userId } = req.params;

    const desiredApi = await this.model.findOne({
      where: {
        userId,
      },
    });

    desiredApi.count = 0;
    await desiredApi.save();

    return res.json(desiredApi);
  }

  async deleteApi(req, res) {
    const { apiId } = req.params;
    try {
      await this.model.destroy({
        where: {
          id: apiId,
        },
      });

      res.status(200).send(`Successfully deleted api${apiId}`);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: true, msg: error });
    }
  }
}

module.exports = APIsController;
