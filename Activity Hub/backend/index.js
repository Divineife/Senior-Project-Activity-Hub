/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const path = require('path')
const mongoose = require ('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Events')
  .then(() => console.log('Connected!'));

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../frontend/views'))


const corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use('/', router)

app.listen(3000, ()=>{
    console.log("app listening on 3000")
})