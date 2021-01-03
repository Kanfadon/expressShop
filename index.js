const express = require('express');
const path = require('path');
const handle = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');

// главный объект express
const app = express();

// объект для создания слоёв
const hbs = handle.create({
    defaultLayout: 'main',
    extname: 'hbs'
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
app.use('/' ,homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

// передача порта в консоли или стандартный
const PORT = process.env.PORT || 3000;

// начать прослушивание сервера по порту
app.listen(PORT, () => {
    console.log(`server is runing on port ${PORT}`);
});


// get запросы html страниц

// app.get('/', (req, res) => {
//     res.status(200); // можно не указывать, идет по умолчанию
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.get('/about', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'about.html'));
// });

