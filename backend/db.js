import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const connecttoDB = async () => {
    await sql
      .connect(config)
      .then(() => {
        console.log("Connected to SQL Server");
      })
      .catch((err) => {
        console.error("Database connection failed:", err);
    });
}

export default connecttoDB