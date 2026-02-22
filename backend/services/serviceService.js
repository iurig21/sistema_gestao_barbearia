import sql from "mssql";

const ServiceService = {
  getServices: async () => {
    try {
      const { recordset: services } =
        await sql.query`SELECT * FROM servicos ORDER BY preco ASC`;

      return services;
    } catch (err) {
      throw err;
    }
  },

  createService: async ({ nome, descricao, preco, imagem }) => {
    try {
      const result =
        await sql.query`INSERT INTO servicos(nome,descricao,preco,imagem) OUTPUT INSERTED.* VALUES (${nome},${descricao},${preco},${imagem})`;

      return result.recordset[0] ?? null;
    } catch (err) {
      throw err;
    }
  },

  updateService: async ({
    id,
    newName,
    newDescription,
    newPrice,
    newImage,
  }) => {
    try {
      const { rowsAffected } =
        await sql.query`UPDATE servicos SET nome = ${newName}, descricao = ${newDescription}, preco = ${newPrice}, imagem = ${newImage} WHERE id = ${id}`;

      return rowsAffected[0] !== 0;
    } catch (err) {
      throw err;
    }
  },

  deleteService: async (id) => {
    try {
      const { rowsAffected } =
        await sql.query`DELETE FROM servicos WHERE id = ${id}`;

      return rowsAffected[0] !== 0;
    } catch (err) {
      throw err;
    }
  },
};

export default ServiceService;
