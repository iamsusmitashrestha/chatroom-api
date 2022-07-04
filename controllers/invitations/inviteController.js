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
      const result = await connection.query(
        "SELECT * from users where username=?",
        [username]
      );
      if (result.length == 0) {
        throw "Username is not found.";
      } else {
        const results = await connection.query(
          "SELECT * from invitations where username=?",
          [username]
        );
        if (results.length == 0) {
          await connection.query(
            "INSERT INTO invitations(username,chatroom_id) VALUES(?,?) ",
            [username, chatroom_id]
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
