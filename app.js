//Import Libraries
import express from 'express';
import mariadb from 'mariadb';

//Define our database credentials
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'pizza',
    port: '3306'
});

//Define function to connect to the DB
async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database!')
        return conn;
    } catch (err) {
        console.log(`Error connecting to the database ${err}`)
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
app.get('/admin', async (req, res) => {

    //Connect to the database
    const conn = await connect();

    //Query the database
    const orders = await conn.query('SELECT * FROM orders')

    console.log(orders);

    res.render('order-summary', { orders });
});

/*
//Define a "thank you" route
app.post('/thankyou', (req, res) => {

    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size
    };

    // Add the order to our array
    //orders.push(order);
    //console.log(orders);

    // Send our thank you page
    res.render('thankyou', { order });
});
*/

//Define a "thank you" route
app.post('/thankyou', async (req, res) => {

    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings,
        size: req.body.size
    };

    //Connect to the database
    const conn = await connect();

    //Query the database
    const sql = 
        `INSERT INTO orders (fname, lname, email, size, 
            method, toppings)
         VALUES ('${order.fname}', '${order.lname}', 
         '${order.email}', '${order.size}', '${order.method}', 
         '${order.toppings}')`;
    console.log(sql);
    const insert = await conn.query(sql);

    // Send our thank you page
    res.render('thankyou', { order });
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
