import sql from "mssql";

const BarbeiroService = {
  getBarbeiros: async () => {
    try {
      const { recordset: barbeiros } = await sql.query`SELECT * FROM barbeiros`;

      return barbeiros;
    } catch (err) {
      throw err;
    }
  },

  barbeiroExists: async (nome) => {
    try {
      const { recordset } =
        await sql.query`SELECT * FROM barbeiros WHERE nome = ${nome}`;

      return recordset.length > 0;
    } catch (err) {
      throw err;
    }
  },

  createBarbeiro: async (nome) => {
    try {
      const result =
        await sql.query`INSERT INTO barbeiros(nome) OUTPUT INSERTED.* VALUES (${nome})`;

      return result.recordset[0] ?? null;
    } catch (err) {
      throw err;
    }
  },

  deleteBarbeiro: async (id) => {
    try {
      const { rowsAffected } =
        await sql.query`DELETE FROM barbeiros WHERE id = ${id}`;

      return rowsAffected[0] !== 0;
    } catch (err) {
      throw err;
    }
  },
};

export default BarbeiroService;
