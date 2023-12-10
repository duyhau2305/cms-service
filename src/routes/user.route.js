const router = require('express').Router();

const userController = require('../controllers/user.controller');

// @route: POST api/users/signup
// @desc: create new user
// @access: public
router.post('/signup', userController.signup)

// @route: POST api/users/signin
// @desc: login user
// @access: public
router.post('/signin', userController.signin)

// @route: GET api/users
// @desc: Get all user
// @access: public
router.get('/', userController.getUsers);

// @route: GET api/users/:id
// @desc: Get one user
// @access: public
router.get('/:id', userController.getUser)

// @route: DELETE api/users/:id
// @desc: Delete user
// @access: public
router.delete('/:id', userController.delete)

// @route: PUT api/users/:id
// @desc: Update user
// @access: public
router.put('/:id', userController.update)

module.exports = router;