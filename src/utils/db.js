import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Leave it blank for XAMPP
  database: 'investment_tracker', // Replace with your database name
});

export default pool;
