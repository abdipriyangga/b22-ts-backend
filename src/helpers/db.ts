import mysql2 from "mysql2";
import * as dotenv from "dotenv";
dotenv.config();

const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

export const execPromise = (sql: string, data: any[]) => {
  return new Promise<any>((resolve, reject) => {
    const execute = db.query(sql, data, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    })
    console.log("query: ",execute);
    
  })
}

export default db;