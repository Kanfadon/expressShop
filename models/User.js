const {Schema, model} = require('mongoose');


// Схема пользователя
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
});

// метод добавления товара в корзину пользователя
userSchema.methods.addToCart = function (course) {
    // клонируем массив корзины
    const clone = [...this.cart.items.concat()];
    // находим в клоне индекс нужного айди курса
    const idx = clone.findIndex(c => {
        return c.courseId.toString() === course._id.toString();
    });

    // если индекс есть в клоне, то добавляем единицу в кол-во существующего курса
    if (idx >= 0) {
        clone[idx].count = clone[idx].count + 1;
    // если нет, то добавляем новый курс в корзину
    } else {
        clone.push({
            courseId: course._id,
            count: 1,
        });
    }

    // помещаем массив обратно в БД
    const newCart = {items: clone};

    this.cart = newCart;

    return this.save();
};

// метод удаления курсов из корзины
userSchema.methods.removeFromCart = function(id) {
    // клонируем массив корзины
    let items = [...this.cart.items];
    // находим в клоне индекс нужного айди курса
    const idx = items.findIndex(c => c.courseId.toString() === id.toString());

    // если количество ед. курса равно 1, удаляем полностью его из корзины
    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id.toString());
    // иначе вычитаем единицу из кол-ва
    } else {
        items[idx].count--;
    }

    // помещаем массив обратно в БД
    this.cart = {items};
    return this.save();
};

module.exports = model('User', userSchema);