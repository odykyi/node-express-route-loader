const userDAO = require('./user.dao');

class UserController {
  constructor() {
    this.userDAO = userDAO;
  }

  async get(req, res) {
    const { id } = req.params;

    return res
      .status(200)
      .json(await this.userDAO.get(id));
  }

  async getAll(req, res) {
    return res
      .status(200)
      .json(await this.userDAO.getAll());
  }

  async remove(req, res) {
    const {
      id,
    } = req.params;

    return res
      .status(204)
      .json(await this.userDAO.remove(id));
  }

  async update(req, res) {
    const {
      id,
    } = req.params;

    return res
      .status(200)
      .json(await this.userDAO.update(id, req.body));
  }
}

module.exports = new UserController();
