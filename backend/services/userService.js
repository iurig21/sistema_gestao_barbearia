import sql from "mssql";

const UserService = {
  getUserByEmail: async (email) => {
    try {
      const result =
        await sql.query`SELECT * FROM utilizadores WHERE email = ${email}`;

      return result.recordset[0] ?? null;
    } catch (err) {
      throw err;
    }
  },

  getUsers: async () => {
    try {
      const { recordset: users } =
        await sql.query`SELECT id, nome, email, telefone, datanascimento, genero, role, fotografia, documento FROM utilizadores ORDER BY nome ASC`;

      return users ?? null;
    } catch (err) {
      throw err;
    }
  },

  createUser: async ({
    nome,
    datanascimento,
    morada,
    email,
    telefone,
    genero,
    fotografia,
    documento,
    password,
  }) => {
    try {
      const result = await sql.query`
        INSERT INTO utilizadores(nome, datanascimento, morada, email, telefone, genero, fotografia, documento, password)
        OUTPUT INSERTED.id
        VALUES (${nome}, ${datanascimento}, ${morada}, ${email}, ${telefone}, ${genero}, ${fotografia}, ${documento}, ${password})`;

      return result.recordset[0] ?? null;
    } catch (err) {
      throw err;
    }
  },

  deleteUser: async (id) => {
    try {
      const { rowsAffected } =
        await sql.query`DELETE FROM utilizadores WHERE id = ${id}`;

      return rowsAffected[0] == 0 ? false : true

    } catch (err) {
      throw err;
    }
  },
};

export default UserService;
