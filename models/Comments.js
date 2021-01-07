const fs = require('fs');
const path = require('path');

class Comments {
    static dateNow() {
        const currentDate = new Date();
        return `   (${currentDate.getHours() + 6 < 10 ? '0' + currentDate.getHours() + 6 : currentDate.getHours() + 6}:${currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()}:${currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds()})`;
    }

    static async save(data) {
        const comments = await Comments.getAll();
        comments.push(data + Comments.dateNow());
        
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'Comments.json'),
                JSON.stringify(comments),
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    }

    static getAll(reverse = false) {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'comments.json'),
                'utf-8',
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else if (reverse === true){
                        resolve(JSON.parse(data).reverse());
                    } else {
                        resolve(JSON.parse(data));
                    }
                });
        });
    }
}

module.exports = Comments;