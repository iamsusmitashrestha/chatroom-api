import mysql from "promise-mysql";

export default async (req, res) => {
  const admin_user_id = req.payload.id;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "chat",
    });
    if (!req.body.name) {
      res.status(403).json({ message: "Chatroom name is required." });
    } else {
      const results = await connection.query(
        "SELECT * from chatroom where admin_user_id=?",
        [admin_user_id]
      );
      if (results.length > 2) {
        res
          .status(403)
          .json({ message: "You can not create more than three chatroom." });
      } else {
        await connection.query(
          "INSERT INTO chatroom(admin_user_id,name) VALUES(?,?)",
          [admin_user_id, req.body.name]
        );

        res.json({
          message: "Chatroom created.",
        });
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
