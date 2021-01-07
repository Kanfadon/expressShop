const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const User = require('./models/User');
const ordersRoutes = require('./routes/orders');

// главный объект express
const app = express();

// объект для создания слоёв
const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

// задать движок рендеринга html
app.engine('hbs', hbs.engine);

// начать использовать движок
app.set('view engine', 'hbs');

// Задать папку шаблонов
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5ff5dc75696fac232819de58');
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
    }
});

// добавить папку статики
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.urlencoded({
    extended: true
}));

app.use('/orders', ordersRoutes);
app.use('/' ,homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
// передача порта в консоли или стандартный
const PORT = process.env.PORT || 3000;

// Данные базы данных
const userName = 'admin';
const password = 'nov6481';


async function start() {
    try {
        
        await mongoose.connect(`mongodb+srv://admin:1q2w3e4r5t6y@cluster0.bxmxh.mongodb.net/shop?retryWrites=true&w=majority`, 
        {useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'Artem@index.ru',
                name: 'Artem',
                cart: {items: []}
            });
            await user.save();
        }
        // начать прослушивание сервера по порту
        app.listen(PORT, () => {
        console.log(`server is runing on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();


// get запросы html страниц

// app.get('/', (req, res) => {
//     res.status(200); // можно не указывать, идет по умолчанию
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.get('/about', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'about.html'));
// });

