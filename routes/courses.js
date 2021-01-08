const {Router} = require('express');
const Course = require('../models/Course');
const auth = require('../middleware/auth');


const router = Router();

// роут для загрузки страницы курсов
router.get('/', async (req, res) => {
    const courses = await Course.find()
    .populate('userId', 'email name')
    .select('price title img');
    
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    });
});

// роут для пост запроса на удаление курса
router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id
        });
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
        
    }
});

// роут для открытия страницы конкретного курса
router.get('/:id',  async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    });
});

// роут для редактирования конкретного курса
router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    const course = await Course.findById(req.params.id);

    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    });
});

// роут для пост запросы на удаление конкретного курса
router.post('/edit', auth, async (req, res) => {
    const {id} = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
});

module.exports = router;