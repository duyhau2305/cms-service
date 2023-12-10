const bcrypt = require('bcryptjs');
const userServices = require('../services/user.service');

module.exports = {
  getUsers: async (_, res) => {
    const users = await userServices.findAll();
    res.status(200).json({
      data: users,
      message: 'Get Users Successfully!',
      isSuccess: true
    })
  },
  
  signup: async (req, res) => {
    const { first_name, last_name, email, password } = req.body?.data || {};

    // check email exist
    const user = await userServices.findEmail(email);
    if(user) {
      res.status(400).json({
        message: 'Email already exist!',
        isSuccess: false
      });
      return;
    };

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // create new user
    const payload = {
      first_name,
      last_name,
      email,
      password: hashPassword
    }

    try {
      await userServices.create(payload);
      res.status(200).json({
        message: 'Create User Successfully!',
        isSuccess: true,
        data: {
          first_name,
          last_name,
          email
        }
      });
    } catch (err) {
      res.status(500).json({
        message: 'Create User Failed!',
        isSuccess: false
      });
      return;
    }
  },

  signin: async (req, res) => {
    const { email, password } = req.body?.data || {};

    // check email exist
    const user = await userServices.findEmail(email);
    if(!user) {
      res.status(400).json({
        message: 'Email or password is wrong.',
        isSuccess: false
      });
      return;
    };

    // check password
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) {
      res.status(400).json({
        message: 'Email or password is wrong.',
        isSuccess: false
      });
      return;
    };

    res.status(200).json({
      message: 'Login Successfully!',
      isSuccess: true,
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  },

  getUser: async (req, res) => {
    const id = req.params.id; // get id from url
    try {
      const user = await userServices.findOne(id);
      const { password, ...data } = user._doc; // get all data except password
      res.status(200).json({
        data,
        message: 'Get User Successfully!',
        isSuccess: true
      });
    } catch(err) {
      res.status(500).json({
        message: 'Get User Failed!',
        isSuccess: false
      });
    }
  },

  delete: async (req, res) => {
    const id = req.params.id; // get id from url
    try {
      await userServices.remove(id);
      res.status(200).json({
        message: 'Remove User Successfully!',
        isSuccess: true
      });
    } catch(err) {
      res.status(500).json({
        message: 'Remove User Failed!',
        isSuccess: false,
      });
    }
  },

  update: async (req, res) => {
    const id = req.params.id; // get id from url
    const { first_name, last_name } = req.body?.data || {}; // get data from body

    const payload = {
      first_name,
      last_name,
      update_at: new Date()
    }
    try {
      const user = await userServices.update(id, payload);
      res.status(200).json({
        message: 'Update User Successfully!',
        isSuccess: true,
        data: user
      });
    } catch(err) {
      res.status(500).json({
        message: 'Update User Failed!',
        isSuccess: false,
      });
    }
  },
}