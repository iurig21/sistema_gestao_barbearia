import sql from "mssql";

const UserService = {
  getUserById: async (id) => {
    try {
      const result = await sql.query`SELECT * FROM utilizadores WHERE id = ${id}`;
      return result.recordset[0] ?? null;
    } catch (err) {
      throw err;
    }
  },

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
        await sql.query`SELECT id, nome, email, telefone, datanascimento, genero, role, fotografia FROM utilizadores WHERE nome <> "admin" ORDER BY nome ASC`;

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
    password,
  }) => {
    try {
      const result = await sql.query`
        INSERT INTO utilizadores(nome, datanascimento, morada, email, telefone, genero, fotografia, password)
        OUTPUT INSERTED.id
        VALUES (${nome}, ${datanascimento}, ${morada}, ${email}, ${telefone}, ${genero}, ${fotografia}, ${password})`;

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

  setEmailToken: async (userId, token) => {
    try {
      await sql.query`UPDATE utilizadores SET email_token = ${token} WHERE id = ${userId}`;
    } catch (err) {
      throw err;
    }
  },

  getUserByEmailToken: async (token) => {
    try {
      const result = await sql.query`SELECT * FROM utilizadores WHERE email_token = ${token}`;
      return result.recordset[0] ?? null;
    } catch (err) {
      throw err;
    }
  },

  verifyUserEmail: async (userId) => {
    try {
      await sql.query`UPDATE utilizadores SET email_verificado = 1, email_token = NULL WHERE id = ${userId}`;
    } catch (err) {
      throw err;
    }
  },

  setPhoneCode: async (userId, code) => {
    try {
      await sql.query`UPDATE utilizadores SET telefone_code = ${code} WHERE id = ${userId}`;
    } catch (err) {
      throw err;
    }
  },

  getUserByPhoneCode: async (userId, code) => {
    try {
      const result = await sql.query`SELECT * FROM utilizadores WHERE id = ${userId} AND telefone_code = ${code}`;
      return result.recordset[0] ?? null;
    } catch (err) {
      throw err;
    }
  },

  verifyUserPhone: async (userId) => {
    try {
      await sql.query`UPDATE utilizadores SET telefone_verificado = 1, telefone_code = NULL WHERE id = ${userId}`;
    } catch (err) {
      throw err;
    }
  },

  updateUser: async ({ userId, newPassword, newTelefone, newMorada, newPhoto }) => {
    try {
      const setClauses = [];
      const request = new sql.Request();

      if (newPassword) {
        setClauses.push("password = @newPassword");
        request.input("newPassword", sql.NVarChar, newPassword);
      }
      if (newTelefone) {
        setClauses.push("telefone = @newTelefone");
        request.input("newTelefone", sql.NVarChar, newTelefone);
      }
      if (newMorada) {
        setClauses.push("morada = @newMorada");
        request.input("newMorada", sql.NVarChar, newMorada);
      }
      if (newPhoto) {
        setClauses.push("fotografia = @newPhoto");
        request.input("newPhoto", sql.NVarChar, newPhoto);
      }

      if (setClauses.length === 0) return false;

      request.input("userId", sql.Int, userId);
      const query = `UPDATE utilizadores SET ${setClauses.join(", ")} WHERE id = @userId`;
      const result = await request.query(query);

      return result.rowsAffected[0] > 0;
    } catch (err) {
      throw err;
    }
  }
};

export default UserService;
