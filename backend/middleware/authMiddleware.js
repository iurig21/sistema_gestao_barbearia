import jwt from "jsonwebtoken";
import sql from "mssql";

function authMiddleware(req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const id = decoded.id

    const {recordset: user} = await sql.query`SELECT * FROM utilizadores WHERE id = ${id}`

    req.user = user[0];
    next();
  });
}

export default authMiddleware;
