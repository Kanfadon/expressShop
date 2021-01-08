const {
    Router
} = require('express');
const fs = require('fs');
const path = require('path');
const Comments = require('../models/Comments');


const router = Router();

// роут для отрисовки главной страницы
router.get('/', async (req, res) => {
    const comments = await Comments.getAll(true);

    res.render('index', {
        title: 'Главная',
        isHome: true,
        comments
    });
});

// роут для пост запроса на отправку сообщения
router.post('/send-message', async (req, res) => {
    if (req.session.isAuthenticated) {
        const comment = await Comments.save(req.body.message, req.session.user.name);
    } else {
        const comment = await Comments.save(req.body.message, 'анон');
    }
    
    res.redirect('/');
});

module.exports = router;