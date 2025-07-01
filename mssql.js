// const sql = require('mssql');


// const express=require('express');

// const cors=require('cors');

// const app=express();



// app.use(express.json());

// app.use(cors());


// const config = {
//   user: 'lavanyap',
//   password: 'Welcome#1992',
//   server: '192.168.4.212', // or 'localhost\\SQLEXPRESS'
//   database: 'vendorATS',
//   options: {
//     encrypt: false, // use true if connecting to Azure
//     trustServerCertificate: true // required for self-signed certs
//   }
// };

// async function connectAndQuery() {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool.request().query('SELECT * FROM [VendorReg_tbl]');
//     console.log(result.recordset);
//   } catch (err) {
//     console.error('SQL error', err);
//   } finally {
//     sql.close();  // always close connection
//   }
// }

// connectAndQuery();



//   const PORT = 5000;

//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// db.js
const sql = require('mssql');

const config = {
  user: 'lavanyap',
  password: 'Welcome#1992',
  server: '192.168.4.212',
  database: 'vendorATS',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

module.exports = {
  sql,
  config,
};