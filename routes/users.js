import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

var express = require('express');
var router = express.Router();

/* GET users. */
router.get('/', function(req, res, next) {
  res.send('not implemented yet!');
});

/* POST users. */
router.post('/', function(req, res, next) {
  res.send('not implemented yet!');
});

/* GET users/sign-in */
router.get('/sign-in', function(req, res, next) {
  res.send('not implemented yet!');
  // err message upon auth failure
});

/* POST users/sign-in */
router.post('/sign-in', function(req, res, next) {
  res.send('not implemented yet!');
});

/* GET users/sign-up */
router.get('/sign-up', function(req, res, next) {
  res.send('not implemented yet!');
  // err message upon auth failure
});

/* POST users/sign-up */
router.post('/sign-up', function(req, res, next) {
  // sanitize & validate input
  res.send('not implemented yet!');
});

module.exports = router;
