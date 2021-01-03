const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');


// Реализация модели добавления объекта курса
class Course {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuidv4(); // генерация рандомного id
    }

    // Вспомагательная функция
    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        };
    }

    // Сохранение объекта в массив
    async save() {
        // Прочитать массив из json
        const courses = await Course.getAll();
        // Добавить новый объект в массив
        courses.push(this.toJSON());
        // Записать массив обратно в json
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    }

    // Прочитать массив из json
    static getAll() {
        
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(JSON.parse(data));
                    }
                });
        });
    }

    // загрузка страницы метода по id
    static async getById(id) {
        const courses = await Course.getAll();
        // возвращение найденного по id курса 
        return courses.find(c => c.id === id);
    }

    static async update(course) {
        const courses = await Course.getAll();
        const idx  = courses.findIndex(c => c.id === course.id);
        courses[idx] = course;
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    }
}

module.exports = Course;