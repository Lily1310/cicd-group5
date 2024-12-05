const express = require('express');
const router = express.Router();

const {getOrderHistory} = require('../models/orderHistory.model');

router.get('/:userId', (req, res, next) => {
    const userId = res.locals.userId;
    getOrderHistory(userId)
      .then((data) => res.status(200).json(data))
      .catch(next);
  });

module.exports = router;