import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

var express = require('express');
var router = express.Router();

/* GET comments. */
router.get('/', function(req, res, next) {
    res.send('not implemented yet!');
});

/* POST comments. */
router.post('/', function(req, res, next) {
    res.send('not implemented yet!');
  });

/* GET comments/:commentid */
router.get('/:commentid', function(req, res, next) {
    res.send('not implemented yet!');
  });

/* PUT comments/:commentid */
router.get('/:commentid', function(req, res, next) {
    res.send('not implemented yet!');
  });

module.exports = router;
