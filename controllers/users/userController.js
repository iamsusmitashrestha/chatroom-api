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
      "SELECT users.name,users.username,users.id FROM `users` INNER JOIN participants ON users.id != participants.user_id and participants.chatroom_id=5",
      [chatroom_id]
    );

    res.json({
      users: result,
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
