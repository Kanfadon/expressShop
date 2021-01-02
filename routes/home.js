const {
    Router
} = require('express');
const fs = require('fs');
const path = require('path');
const Comments = require('../models/Comments');
const router = Router();

router.get('/', async (req, res) => {
    const comments = await Comments.getAll(true);

    res.render('index', {
        title: 'Главная',
        isHome: true,
        comments
    });
});

router.post('/send-message', async (req, res) => {
    const comment = await Comments.save(req.body.message);
    res.redirect('/');
});

module.exports = router;