const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      res.status(404).json({ 
        message: 'Email or password is wrong.',
        isSuccess: false
      }); 
      return;
    };

    // check password
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) {
      res.status(404).json({
        message: 'Email or password is wrong.',
        isSuccess: false
      });
      return;
    };

    const payload = {
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    }

    // generate token
    const access_token = jwt.sign(
      payload,
      'haunguyen',
      { expiresIn: 2700 }
    )
    const refresh_token = jwt.sign(
      payload,
      'haunguyen',
      { expiresIn: 3600 }
    )

    res.status(200).json({
      message: 'Login Successfully!',
      isSuccess: true,
      data: {
        access_token,
        refresh_token
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

  checkAuth: async (req, res) => {
    const access_token = req.header('x-auth-token');

    if(!access_token) {
      res.status(401).json({
        message: 'Access Denied!',
        isSuccess: false
      });
      return;
    }

    try {
      const user = jwt.verify(access_token, 'haunguyen');
      res.json({
        message: 'Auth Successfully!',
        isSuccess: true,
        data: user
      })
    } catch(err) {
      res.status(401).json({
        message: 'Access Denied!',
        isSuccess: false
      });
    }
  },

  refreshToken: async(req, res) => {
    const refresh_token = req.header('x-refresh-token');

    if(!refresh_token) {
      res.status(401).json({
        message: 'Access Denied!',
        isSuccess: false
      });
      return;
    }

    jwt.verify(refresh_token, 'haunguyen', (err, user) => {
      if(err) {
        res.status(404).json({
          message: 'No Authenticate',
          isSuccess: false
        });
        return;
      }

      console.log('user: ', user)

      try {
        const payload = {
          user
        }
    
        // generate token
        const access_token = jwt.sign(
          payload,
          'haunguyen',
          { expiresIn: 2700 }
        )
        res.json({
          message: 'Refresh token Successfully!',
          isSuccess: true,
          data: {
            access_token
          }
        })
      } catch(err) {
        res.status(401).json({
          message: 'Access Denied!',
          isSuccess: false
        });
      }
    })

    
  }
}