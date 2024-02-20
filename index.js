require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
})
let user = mongoose.model('user', userSchema);

app.post('/api/users', async (req, res) => {
  let userInput = req.body.username;
  let userSearch = await user.findOne({username: userInput})
  //If an already existing user name is entered, return that user
  if (userSearch) {
    res.json(userSearch)
  }
  //Otherwise create a new user entry in the database
  else {
    newUser = new user({username: userInput});
    await newUser.save();
    console.log(newUser);
    res.json(newUser)
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
