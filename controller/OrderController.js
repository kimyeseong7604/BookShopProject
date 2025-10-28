const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host : '127.0.0.1',
        user : 'root',
        password : 'root',
        database : 'Bookshop',
        dataStrings : true
    });

    const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

    let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);"
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values);
    let delivery_id = results.insertId;

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
            VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
    [results] = await conn.execute(sql, values);
    let order_id = results.insertId;

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    items.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    })
    results = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn);

    return res.status(StatusCodes.OK).json(results[0]);
}

const deleteCartItems = async (conn) => {
    let sql = "DELETE FROM cartItems WHERE id IN (?)";
    let values = [1, 2, 3];

    let result = await conn.query(sql, [values]);
    return result;
}

const getOrders = async (req, res) => {
     const conn = await mariadb.createConnection({
        host : '127.0.0.1',
        user : 'root',
        password : 'root',
        database : 'Bookshop',
        dataStrings : true
    });
    
    let sql = `SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
                FROM orders LEFT JOIN delivery
                ON orders.delivery_id = delivery.id`;

    let [rows, fields] = await conn.query(sql);

    return res.status(StatusCodes.OK).json(rows);
}

const getOrderDetail = async (req, res) => {
    const {id} = req.params;

    const conn = await mariadb.createConnection({
        host : '127.0.0.1',
        user : 'root',
        password : 'root',
        database : 'Bookshop',
        dataStrings : true
    });
    
    let sql = `SELECT book_id, title, author, price, quantity
                FROM orderedBook LEFT JOIN books
                ON orderedBook.book_id = books.id
                WHERE orders.id = ?`;

    let [rows, fields] = await conn.query(sql, [id]);

    return res.status(StatusCodes.OK).json(rows);
}


module.exports = {
    order,
    getOrders,
    getOrderDetail
};