import sql from "mssql";

const AppointmentService = {
  getAppointmentsByUser: async (userID) => {
    try {
      const { recordset: appointments } =
        await sql.query`SELECT m.id, m.user_id, s.nome AS nome_servico, b.nome AS barbeiro_nome, CONVERT(VARCHAR(10), m.data, 103) AS data_formatada, CONVERT(VARCHAR(5), m.hora, 108) AS hora_formatada FROM marcacoes m INNER JOIN servicos s ON m.servico_id = s.id LEFT JOIN barbeiros b ON m.barbeiro_id = b.id WHERE m.user_id = ${userID} ORDER BY m.data ASC, m.hora ASC`;

      return appointments;
    } catch (err) {
      throw err;
    }
  },

  getAllAppointments: async () => {
    try {
      const { recordset: appointments } =
        await sql.query`SELECT m.id, m.user_id, u.nome AS usuario_nome, s.nome AS servico_nome, b.nome AS barbeiro_nome, m.barbeiro_id, CONVERT(VARCHAR(10), m.data, 103) AS data_formatada, CONVERT(VARCHAR(5), m.hora, 108) AS hora_formatada FROM utilizadores u INNER JOIN marcacoes m ON u.id = m.user_id INNER JOIN servicos s ON m.servico_id = s.id LEFT JOIN barbeiros b ON m.barbeiro_id = b.id ORDER BY m.data ASC, m.hora ASC`;

      return appointments;
    } catch (err) {
      throw err;
    }
  },

  getBookedSlots: async (date, barbeiroId) => {
    try {
      const query = barbeiroId
        ? await sql.query`SELECT CONVERT(VARCHAR(5), hora, 108) AS hora FROM marcacoes WHERE data = ${date} AND barbeiro_id = ${barbeiroId}`
        : await sql.query`SELECT CONVERT(VARCHAR(5), hora, 108) AS hora FROM marcacoes WHERE data = ${date}`;

      return query.recordset.map((slot) => slot.hora);
    } catch (err) {
      throw err;
    }
  },

  checkAvailability: async (data, hora, barbeiroID) => {
    try {
      const { recordset } =
        await sql.query`SELECT * FROM marcacoes WHERE data = ${data} AND hora = ${hora} AND barbeiro_id = ${barbeiroID}`;

      return recordset.length === 0;
    } catch (err) {
      throw err;
    }
  },

  createAppointment: async ({ userID, servicoID, data, hora, barbeiroID }) => {
    try {
      const result =
        await sql.query`INSERT INTO marcacoes(user_id,servico_id,data,hora,barbeiro_id) OUTPUT INSERTED.* VALUES (${userID},${servicoID},${data},${hora},${barbeiroID})`;

      return result.recordset[0] ?? null;
    } catch (err) {
      throw err;
    }
  },

  deleteAppointment: async (id) => {
    try {
      const { rowsAffected } =
        await sql.query`DELETE FROM marcacoes WHERE id = ${id}`;

      return rowsAffected[0] !== 0;
    } catch (err) {
      throw err;
    }
  },
};

export default AppointmentService;
