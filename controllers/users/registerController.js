import mysql from "promise-mysql";

export default async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "chat",
    });
    if (!req.body.name) {
      res.status(403).json({ message: "Name is required." });
    } else if (!req.body.email) {
      res.status(403).json({ message: "Email is required." });
    } else if (!req.body.username) {
      res.status(403).json({ message: "Username is required." });
    } else if (!req.body.gender) {
      res.status(403).json({ message: "Gender is required." });
    } else if (!req.body.date_of_birth) {
      res.status(403).json({ message: "Date of birth is required." });
    } else if (!req.body.password) {
      res.status(403).json({ message: "Password is required." });
    } else if (req.body.password.length < 8 || req.body.password.length > 20) {
      res.status(403).json({
        message: "Password length must be between 8 to 20 characters.",
      });
    } else if (!req.body.email.includes("@")) {
      res.status(403).json({
        message: "Enter a valid email.",
      });
    } else if (!req.body.name.includes(" ")) {
      res.status(403).json({
        message: "Enter full name.",
      });
    } else {
      const results = await connection.query(
        "SELECT * FROM `users` WHERE email=?",
        [req.body.email]
      );
      if (results.length > 0) {
        res.status(403).json({
          message: "Email already exist.",
        });
      } else {
        const results = await connection.query(
          "SELECT * FROM `users` WHERE username=?",
          [req.body.username]
        );
        if (results.length > 0) {
          res.status(403).json({
            message: "Username already exist.",
          });
        } else {
          await connection.query(
            "INSERT INTO users(name,email,username,gender,date_of_birth,password) VALUES(?,?,?,?,?,?) ",
            [
              req.body.name,
              req.body.email,
              req.body.username,
              req.body.gender,
              req.body.date_of_birth,
              req.body.password,
            ]
          );

          res.json({
            message: "Registered successfully.",
          });
        }
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
