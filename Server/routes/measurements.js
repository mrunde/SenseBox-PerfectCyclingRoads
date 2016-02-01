var express = require('express');
var router = express.Router();

var list = require('../controllers/measurements/list');
var post = require('../controllers/measurements/post');
var get = require('../controllers/measurements/get');
var delAll = require('../controllers/measurements/delete_all');
var del = require('../controllers/measurements/delete');


// LIST
router.get('/boxes/:boxId/tracks/:trackId/measurements', list.request);


// POST
router.post('/boxes/:boxId/tracks/:trackId/measurements', post.request);


// GET
router.get('/boxes/:boxId/tracks/:trackId/measurements/:measurementId', get.request);


// DELETE ALL
router.delete('/boxes/:boxId/tracks/:trackId/measurements', delAll.request);


// DELETE
router.delete('/boxes/:boxId/tracks/:trackId/measurements/:measurementId', del.request);


module.exports = router;
