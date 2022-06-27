import mysql from "promise-mysql";
import jwt from "jwt-then";

export default async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "chat",
    });
    if (!req.body.email) {
      res.status(403).json({ message: "Email is required." });
    } else if (!req.body.password) {
      res.status(403).json({ message: "Password is required." });
    } else {
      const result = await connection.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [req.body.email, req.body.password]
      );
      if (result.length > 0) {
        const token = await jwt.sign(
          {
            id: result[0].id,
          },
          "tero tauko"
        );
        res.json({ message: "Login successfully", token: token });
      } else {
        res.status(403).json({ message: "Email and password did not match." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error.",
    });
  } finally {
    if (connection) {
      connection.end();
    }
  }
};
