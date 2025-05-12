import express from 'express';
import { ObjectId } from 'mongodb';
import db from '../db/conn.js';//connection to MongoDB
import { param } from './seed';

const router = express.Router();

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

export default router;