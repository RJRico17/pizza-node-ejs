//Import Libraries
import express from 'express';

//import mariadb
import mariadb from 'mariadb';

import { validateForm } from './services/validateForm.js';

import dotenv from 'dontenv';
dotenv.config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

//connect to mariadb
async function connect() {
    try {
        const connection = await pool.getConnection();
        console.log(`Connected to database: ${pool.database}`);
        return connection;
    } catch (err) {
        console.log('Error connecting to database: ' + err);
    }
}

//Instantiate an Express application
const app = express();

//Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//Set the view engine for our application
app.set('view engine', 'ejs');

//Serve static files from the 'public' directory
app.use(express.static('public'));

//Define a port number for our server to listen on
const PORT = 3000;


//Define a "default" route for our home page
app.get('/', (req, res) => {
    // Send our home page as a response to the client
    res.render('home');
});

//Define an admin route
app.get('/admin', async(req, res) => {
    const connection = await connect();
    const orders = await connection.query('SELECT * FROM orders;');
    console.log(orders);
    res.render('order-summary', { orders });
});

//Define a "thank you" route
app.post('/thankyou', async(req, res) => {

    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size,
        date: new Date()
    };
    const result = validateForm(order);
    if (!result.isValid) {
        console.log(result.errors);
        res.send(result.errors);
        return;
    }
    
    const connection = await connect();
    const orders = await connection.query(`INSERT INTO orders (firstName,lastName,email,method,toppings,size)
        VALUES ("${order.fname}","${order.lname}","${order.email}","${order.method}","${order.toppings}","${order.size}");`);
    console.log(order);
    // Send our thank you page
    res.render('thankyou', { order });
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
