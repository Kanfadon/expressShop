const {Schema, model} = require('mongoose');

// Схема курсов
const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// метод отрисовки данных курсов на клиенте (чтобы не писать везде _id, а просто id)
courseSchema.method('toClient', function() {
    const course = this.toObject();

    course.id = course._id;
    delete course._id;
});

module.exports = model('Course', courseSchema);