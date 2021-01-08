const {
    Router
} = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        UserLogError: req.flash('UserLogError'),
        UserRegError: req.flash('UserRegError')
    });
});

router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const condidate = await User.findOne({
            email
        });

        if (condidate) {
            const correctPassword = await bcrypt.compare(password, condidate.password);
            if (correctPassword) {
                const user = condidate;
                req.session.user = user;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/');
                });
            } else {
                req.flash('UserLogError', 'Неверный пароль!');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('UserLogError', 'Пользователь с таким email не существует!');
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);

    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.post('/registration', async (req, res) => {
    try {
        const {
            rname,
            remail,
            rpassword,
            confirm
        } = req.body;
        const condidate = await User.findOne({
            email: remail
        });
        if (condidate) {
            req.flash('UserRegError', 'Пользователь с таким email уже существует!');
            res.redirect('/auth/login#registration');
        } else {
            const correctPassword = rpassword === confirm;
            console.log(rname, remail, rpassword, confirm);
            
            if (correctPassword) {
                const condidateName = await User.findOne({name: rname});
                if (condidateName) {
                    req.flash('UserRegError', 'Пользователь с таким именем уже существует!');
                    res.redirect('/auth/login#registration');
                } else {
                    const hashPassword = await bcrypt.hash(rpassword, 10);
                    const user = new User({
                        name: rname,
                        email: remail,
                        password: hashPassword,
                        cart: {
                            items: []
                        }
                    });
                    await user.save();
                    res.redirect('/auth/login#login');
                }
            } else {
                req.flash('UserRegError', 'Введенные пароли не совпадают!');
                res.redirect('/auth/login#registration');
            }
        }
    } catch (e) {
        console.log(e);

    }
});

module.exports = router;