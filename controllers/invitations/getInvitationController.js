import mysql from "promise-mysql";

export default async (req, res) => {
  const user_id = req.payload.id;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "chat",
    });

    const result = await connection.query(
      "SELECT invitations.chatroom_id,chatroom.name FROM invitations inner join chatroom on invitations.chatroom_id=chatroom.id  where user_id=?",
      [user_id]
    );

    res.json({
      chatrooms: result,
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
