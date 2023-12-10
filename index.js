const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = 3000;

// routes
const userRoute = require('./src/routes/user.route');

app.use(cors());

// connect db
mongoose
  .connect('mongodb+srv://haunguyen:haunguyen123@cluster0.wwndzbr.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error', err));


// configs
app.use(express.json()); // for parsing application/json

// using routes
app.use('/api/users', userRoute);


// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// demo structure

// // service
// const findBook = () => {
//   const bookName = 'tony';
//   return bookName;
// }

// // controller
// const updateBook = (req, res) => {
//   // get params: 
//   const userId = req.params.userId;
//   const bookId = req.params.bookId;

//   // get body data
//   const email = req.body.data.email;
//   const password = req.body.data.password;

//   // call service
//   const bookName = findBook();

//   res.send(`update user: ${userId}, book: ${bookId}, email: ${email}, password: ${password}, bookName: ${bookName}`);
// };

// // for example: route
// app.get('/', (req, res) => {
//   res.send('get app')
// })
// app.post('/', (req, res) => {
//   res.send('create app')
// })
// app.delete('/', (req, res) => {
//   res.send('delete app')
// })
// app.put('/', (req, res) => {
//   res.send('update app')
// })
// app.post('/login', (req, res) => { 
//   res.send('login')
// });
// app.put('/user/:userId/book/:bookId', updateBook);
