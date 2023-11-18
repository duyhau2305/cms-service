const express = require('express')
const app = express()
const port = 3000


app.use(express.json()); // for parsing application/json

// service
const findBook = () => {
  const bookName = 'tony';
  return bookName;
}

// controller
const updateBook = (req, res) => {
  // get params: 
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  // get body data
  const email = req.body.data.email;
  const password = req.body.data.password;

  // call service
  const bookName = findBook();

  res.send(`update user: ${userId}, book: ${bookId}, email: ${email}, password: ${password}, bookName: ${bookName}`);
};

// for example: route
app.get('/', (req, res) => {
  res.send('get app')
})
app.post('/', (req, res) => {
  res.send('create app')
})
app.delete('/', (req, res) => {
  res.send('delete app')
})
app.put('/', (req, res) => {
  res.send('update app')
})
app.post('/login', (req, res) => { 
  res.send('login')
});
app.put('/user/:userId/book/:bookId', updateBook);


// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})