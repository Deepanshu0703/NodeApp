const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DB,
    password:process.env.PASSWORD,
    user: process.env.USER
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});


const insert= (id, name, last, bs, volume, base_unit) => {
    connection.query(`INSERT INTO List (id, name, last, bs, volume, base_unit) VALUES ('${id}', '${name}', '${last}', '${bs}', '${volume}', '${base_unit}')`, (err, res) => {
            if (err){
                console.log("Error Occured: " + err);
            }
})};

const select = async() => {
    let obj = [];
    try {
        const res = connection.query("SELECT * FROM List");
        obj = res.rows;
    } catch (err) {
        console.log("Error Occured: " + err);
    }
    return obj;
};


const truncate= () => {
    connection.query(`TRUNCATE TABLE List`, (err, res) => {
        if (err) {
            console.log("Error Occured: " + err);
        }
    });
};


module.exports = { connection};
