const express = require('express')
const router = express.Router()
const multer = require('multer')

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

router.get("/", (req, res) => {
    // res.render("home");
    res.send("HOME")
})

router.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body)
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    // If a file is uploaded successfully, respond with a success message
    res.status(200).json({ message: 'File uploaded successfully' });
  });

router.get('/users', (req,res) => {
    const test = [ {"id" : 1, "name" : "test", "website": "test1.com"}, {"id" : 2, "name" : "test2", "website": "test2.com"}, {"id" : 3, "name" : "test3", "website": "test3.com"}]
    res.send(test);
})

module.exports = router;