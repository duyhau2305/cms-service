const userServices = require('../services/user.service');

module.exports = {
  getUsers: async (req, res) => {
    const users = await userServices.findAll();

    console.log('users: ', users)
    
    res.status(200).json({
      data: users,
      message: 'Get Users Successfully!',
      isSuccess: true
    })
  }
}