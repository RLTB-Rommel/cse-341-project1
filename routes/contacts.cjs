const express = require('express');
const {ObjectId} = require('mongodb');
const { getDb } = require('../db/connect'); 

const router = express.Router();
const db = getDb();

//get all  contacts
router.get('/',async (req, res) => {
    try {
        const contacts = await db.collection('contacts').find().toArray();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json ({error: 'Failed to fetch contacts'});
    }
});

//get single contact by ID

router.get('/:id', async (req,res)=>{
    try {
        const id = new ObjectId(req.params.id);
        const contact = await db.collection('contacts').findOne({_id:id});

        if (!contact) return res.status(404).json({error: 'Contact not found.'});

        res.status(200).json(contact);
    } catch (err) {
        res.status(400).json({error: 'Invalid ID format.'});
    }   
});

module.exports = router;