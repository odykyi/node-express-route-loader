const fs = require('fs');
const { promisify } = require('util');

fs.readFile = promisify(fs.readFile);
fs.writeFile = promisify(fs.writeFile);

const usersData = require('./users.json');

const USER_DATA_RELATIVE_PATH = './data/users.json';
const writeUserData = Symbol();

class UserDAO {
  async get(id) {
    return usersData
      .find(user => Number(user.id) === Number(id));
  }

  async getAll() {
    return usersData;
  }

  async remove(id) {
    const updatedUsersData = usersData
      .filter(user => Number(user.id) !== Number(id));

    try {
      await this[writeUserData](updatedUsersData);
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  }

  async update(id, data) {
    const index = usersData.findIndex(user => Number(user.id) === Number(id));
    const updatedUsersData = usersData;
    updatedUsersData[index] = Object.assign({}, updatedUsersData[index], data);

    try {
      await this[writeUserData](updatedUsersData);
    } catch (err) {
      console.error(err);
      return false;
    }

    return updatedUsersData;
  }

  async [writeUserData](updatedUsersData) {
    await fs
      .writeFile(USER_DATA_RELATIVE_PATH, JSON.stringify(updatedUsersData));
  }
}

module.exports = new UserDAO();
