var express = require('express');
var router = express.Router();

var list = require('../controllers/boxes/list');
var post = require('../controllers/boxes/post');
var get = require('../controllers/boxes/get');
var put = require('../controllers/boxes/put');
var del = require('../controllers/boxes/delete');


// LIST
router.get('/boxes', list.request);


// POST
router.post('/boxes', post.request);


// GET
router.get('/boxes/:boxId', get.request);


// PUT
router.put('/boxes/:boxId', put.request);


// DELETE
router.delete('/boxes/:boxId', del.request);


module.exports = router;
