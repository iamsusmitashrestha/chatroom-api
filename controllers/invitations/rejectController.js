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
    await connection.query(
      "DELETE from invitations WHERE invited_to_user_id=? and chatroom_id=?",
      [user_id, req.body.chatroom_id]
    );

    res.json({
      message: "Invitation rejected.",
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
