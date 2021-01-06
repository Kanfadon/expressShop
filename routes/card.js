const {Router} = require('express');
const Course = require('../models/Course');


const router = Router();

// Вспомогательная функция для формирования корзины
function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }));
}

// Вспомогательная функция для расчето итоговой стоимости курсов
function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0);
}

// Удалить товар из корзины
router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

    const courses = mapCartItems(user.cart);

    const cart = {
        courses,
        price: computePrice(courses)
    };

    res.status(200).json(cart);
});

// Добавить новый товар в корзину
router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card');
});

// Получение списка товаров
router.get('/', async  (req, res) => {
    const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

    const courses = mapCartItems(user.cart);

    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    });
});



module.exports = router;