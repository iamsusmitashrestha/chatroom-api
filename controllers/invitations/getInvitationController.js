import mysql from "promise-mysql";

export default async (req, res) => {
  const username = req.params.username;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "chat",
    });

    const result = await connection.query(
      "SELECT chatroom_id FROM invitations where username=?",
      [username]
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
