import mysql from "promise-mysql";

export default async (req, res) => {
  const chatroom_id = req.params.id;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "chat",
    });

    const result = await connection.query(
      "SELECT users.name FROM `users` INNER JOIN `participants` WHERE users.id=participants.user_id AND participants.chatroom_id=?",
      [chatroom_id]
    );

    res.json({
      participants: result,
    });
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
