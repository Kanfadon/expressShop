const {
    Router
} = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');


const router = Router();

// Вывод страницы заказов
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({
                'user.userId': req.user._id
            })
            .populate('user.userId');

        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price;
                    }, 0)
                };
            })
        });
    } catch (e) {
        console.log(e);
    }
});

// Отправка пост запроса на оформление заказа
router.post('/', auth, async (req, res) => {
    try {
        // поулучаем все товары в массив
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate();

        // формируем новый массив заказов
        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {
                ...i.courseId._doc
            }
        }));

        // создаем новый заказ
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        });

        // сохраняем в БД заказ
        await order.save();
        // и очищаем корзину
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;