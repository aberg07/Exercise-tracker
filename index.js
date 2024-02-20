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

const exerciseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    duration: true
  },
  date: {
    type: String
  },
  _id: {
    type: String
  }
})
let exercise = mongoose.model('exercise', exerciseSchema);
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  count: {
    type: Number
  },
  log: {
    type: [exerciseSchema]
  }
})
let user = mongoose.model('user', userSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

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
    res.json(newUser);
  }
})

app.get('/api/users', async (req, res) => {
  let search = await user.find({});
  res.send(search);
})

app.post('/api/users/:id/exercises', async (req, res) => {
  let exerciseDate;
  const search = await user.findById(req.params.id);
  if (!search) res.json({"error": "user not found"});
  else {
    if (!req.body.date) exerciseDate = new Date().toDateString();
    else exerciseDate = new Date(req.body.date).toDateString();
    let toAdd = new exercise({
      username: search.username,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: exerciseDate,
      _id: search._id
    })
    await toAdd.save();
    search.log.push(toAdd);
    await search.save();
    res.json(toAdd);
  }
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
