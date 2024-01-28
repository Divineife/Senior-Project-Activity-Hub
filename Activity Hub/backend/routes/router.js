const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("root");
})
router.get('/users', (req,res) => {
    const test = [ {"id" : 1, "name" : "test", "website": "test1.com"}, {"id" : 2, "name" : "test2", "website": "test2.com"}, {"id" : 3, "name" : "test3", "website": "test3.com"}]
    res.send(test);
})

module.exports = router;