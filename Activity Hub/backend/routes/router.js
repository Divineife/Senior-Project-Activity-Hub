const express = require('express')
const router = express.Router()
const multer = require('multer')
const Event = require("../Models/Event")
const path = require('path');
const mongoose = require ('mongoose')

router.use(express.static(path.join(__dirname, '../front-end/vite-project/src/Components')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/Images');
    },
    filename: function (req, file, cb) {
      // Use the original filename
      cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage: storage})

router.get("/events", async (req, res) => {
    const events = await Event.find({})
    res.send(events)
})

router.get("/events/:id", async (req, res) => {
  const id = req.params.id;
  const event = await Event.findById(id)
  res.send(event)
})

router.get("/makeEvent", async (req, res)=>{
  const event = new Event({
    event_id: new mongoose.Types.ObjectId(), // Generate unique ObjectId
    event_name: "Fisk Watch Party",
    event_desc: "Nigeria to Win AFCON"
  });

  const event2 = new Event({
    event_id: new mongoose.Types.ObjectId(), // Generate unique ObjectId
    event_name: "Vanderbilt Watch Party",
    event_desc: "Nigeria to Win AFCON or Ivory Coast"
  });
  await event.save();
  await event2.save();
  res.send(event)
})

router.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body)
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    // If a file is uploaded successfully, respond with a success message
    res.status(200).json({ message: 'File uploaded successfully' });
  });
module.exports = router;