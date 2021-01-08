const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');


const MONGODB_URI = 'mongodb+srv://admin:1q2w3e4r5t6y@cluster0.bxmxh.mongodb.net/shop?retryWrites=true&w=majority';
// главный объект express
const app = express();

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
});

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

// добавить папку статики
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.urlencoded({
    extended: true
}));


app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/auth', authRoutes);
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
        await mongoose.connect(MONGODB_URI, 
        {useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        // начать прослушивание сервера по порту
        app.listen(PORT, () => {
        console.log(`server is runing on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
