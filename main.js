const express = require('express');
const path = require('path');
var ejs = require('ejs');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config()

const{connection } = require('./config/db');

const port = process.env.PORTHTTP;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//wazirX API
const connect = () => {
    console.log("Connecting to WazirX API");
    fetch('https://api.wazirx.com/api/v2/tickers')
        .then(res => res.json())
        .then(data => {
            const records = Object.values(data).slice(0, 10);
            id = 1;
            records.forEach(record => {
                const { name, last, buy, sell, volume, base_unit } = record;
                bs = `${buy}/${sell}`
                connection.query(`INSERT INTO List (id, name, last, bs, volume, base_unit) VALUES ('${id}', '${name}', '${last}', '${bs}', '${volume}', '${base_unit}')`, (err, res) => {
                    if (err) {
                        console.log("Error Occured: " + err);
                    }
                    
                id += 1;
            })
        })
        .catch(err => console.error(err))
    })
}

app.get("/", function (req, res) {
    //connect();
    connection.query("SELECT * FROM List",(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
    res.render('home', { title: "QuadB", number: "5", responce: result });
    });
});

app.get("/:crypto" , (req,res)=>{
    const currency = req.params.crypto;
    console.log('SELECT * FROM List where base_unit='+mysql.escape(currency));
    connection.query("SELECT * FROM List where base_unit="+mysql.escape(currency),(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
    res.render('home', { title: currency, responce: result })
    });

})

app.listen(port, (err) => {
    if (err) {
        console.log("Error in running server");
        return;
    }
    console.log('listening on port', port);
});
