const express = requre('express');
const data = require('../data');
const questions = data.questions;

router = express.Router();

router.get('/edit/:id', async(req,res) => {
    try{
        const info = await questions.get(req.params.id);
        res.render('edit-question', {
            info: info,
        });
    }catch(e){
        res.sendStatus(500);
    }
});

router.put('/:id', async(req, res) => {
    info = req.body;
    try{
        const updated = await questions.update(req.params.id, info.title, info.description, info.tags, info.communityId);
        if (updated == false){
            res.status(500).json({error: 'Could not update'})
        }
    }catch(e){
        res.sendStatus(500);
    }
    
});