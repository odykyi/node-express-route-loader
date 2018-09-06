const { UserDAO } = require('./user.dao');

class UserController {
  constructor() {
    this.userDAO = new UserDAO();
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

    const result = await this.userDAO.remove(id);
    return res
      .status(204)
      .json(result);
  }

  async update(req, res) {
    const {
      id,
    } = req.params;

    const result = await this.userDAO.update(id, req.body);
    return res
      .status(200)
      .json(result);
  }
}

module.exports = new UserController();
