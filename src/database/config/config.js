"use strict";
require('dotenv').config()

module.exports={
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT||"mysql",
  host: process.env.DB_HOST,
  logging: false,
  dialectOptions: { decimalNumbers: true }
}