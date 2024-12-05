const express = require('express');
const router = express.Router();
const { addNewSuAdmin, deleteSuAdminById } = require('../models/supplierAdmin.model');

// Create a new supplier admin
router.post('/create', (req, res, next) => {
    const {personId} = req.body;
    addNewSuAdmin(personId)
      .then((suAdmin) => res.status(201).json({ message: `Create supplier Admin ${suAdmin.personId} successfully` }))
      .catch(next);
  });
  
//delete supplier admin 
router.delete('/delete', (req, res, next) => {
    const { id } = req.body;
    deleteSuAdminById(parseInt(id))
      .then((suAdmin) => res.status(200).json({ message: `Delete supplier Admin ${suAdmin.id} successfully` }))
      .catch(next);
  });
  module.exports = router;