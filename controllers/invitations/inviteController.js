import mysql from "promise-mysql";

export default async (req, res) => {
  const admin_user_id = req.payload.id;
  const { username, chatroom_id, invited_to_user_id } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "chat",
    });
    if (!username) {
      res.status(403).json({ message: "Username is required." });
    } else {
      const result = await connection.query(
        "SELECT * from users where username=?",
        [username]
      );
      if (result.length == 0) {
        throw "Username is not found.";
      } else {
        await connection.query(
          "INSERT INTO invitations(invited_by_user_id,invited_to_user_id,chatroom_id) VALUES(?,?,?) ",
          [admin_user_id, invited_to_user_id, chatroom_id]
        );

        res.json({
          message: "Invitations sent.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: typeof error === "string" ? error : "Internal server error.",
    });
  } finally {
    if (connection) {
      connection.end();
    }
  }
};
