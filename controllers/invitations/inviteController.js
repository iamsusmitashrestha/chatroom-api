import mysql from "promise-mysql";

export default async (req, res) => {
  const { username, chatroom_id } = req.body;
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
      const [user] = await connection.query(
        "SELECT * from users where username=?",
        [username]
      );
      if (!user) {
        throw "Username is not found.";
      } else {
        const [invitation] = await connection.query(
          "SELECT * from invitations where user_id=? and chatroom_id=?",
          [user.id, chatroom_id]
        );
        if (!invitation) {
          await connection.query(
            "INSERT INTO invitations(user_id,chatroom_id) VALUES(?,?) ",
            [user.id, chatroom_id]
          );

          res.json({
            message: "Invitations sent.",
          });
        } else {
          res.json({ message: "The user is already invited." });
        }
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
