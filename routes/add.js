const {Router} = require('express');
const Course = require('../models/Course');


const router = Router();

// роут для загрузки страницы добавления курсов
router.get('/', (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    });
});

// роут для пост запроса на создание нового курса
router.post('/', async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    });

    try {
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;