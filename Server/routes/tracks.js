var express = require('express');
var router = express.Router();

var list = require('../controllers/tracks/list');
var post = require('../controllers/tracks/post');
var get = require('../controllers/tracks/get');
var delAll = require('../controllers/tracks/delete_all');
var del = require('../controllers/tracks/delete');


// LIST
router.get('/boxes/:boxId/tracks', list.request);


// POST
router.post('/boxes/:boxId/tracks', post.request);


// GET
router.get('/boxes/:boxId/tracks/:trackId', get.request);


// DELETE ALL
router.delete('/boxes/:boxId/tracks', delAll.request);


// DELETE
router.delete('/boxes/:boxId/tracks/:trackId', del.request);


module.exports = router;
