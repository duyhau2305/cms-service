const userModel = require("../models/user.model");

module.exports = {
  findAll: async () => {
    const users = await userModel.find().sort({ data: -1 });
    return users;
  },

  findEmail: async (email) => {
    const user = await userModel.findOne({ email });
    return user;
  },

  findOne: async (id) => {
    const user = await userModel.findById(id);
    return user;
  },

  create: async(payload = {}) => {
    const { first_name, last_name, email, password } = payload;
    const user = new userModel({
      first_name,
      last_name,
      email,
      password
    });
    return user.save();
  },

  remove: async (id) => {
    const user = await userModel.findOneAndDelete({ _id: id });
    return user;
  },

  update: async (id, payload = {}) => {
    const user = await userModel.findOneAndUpdate(
      { _id: id },
      { $set: payload },
      { new: true }
    );
    return user;
  }
}