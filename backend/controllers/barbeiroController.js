import BarbeiroService from "../services/barbeiroService.js";

const barbeiroController = {
  getBarbeiros: async (_, res) => {
    try {
      const barbeiros = await BarbeiroService.getBarbeiros();

      res.status(200).json(barbeiros);
    } catch (err) {
      console.error("Erro ao retornar barbeiros:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createBarbeiro: async (req, res) => {
    try {
      const { nome } = req.body;

      if (!nome.trim()) {
        return res
          .status(400)
          .json({ message: "O nome do barbeiro não pode ser nulo" });
      }

      const exists = await BarbeiroService.barbeiroExists(nome);

      if (exists) {
        return res.status(400).json({ message: "O barbeiro já existe" });
      }

      const barbeiro = await BarbeiroService.createBarbeiro(nome);

      if (!barbeiro) {
        return res.status(400).json({ message: "Erro ao criar barbeiro" });
      }

      res.status(201).json(barbeiro);
    } catch (err) {
      console.error("Error creating a colaborator:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteBarbeiro: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "O id do barbeiro não foi providenciado" });
      }

      const deleted = await BarbeiroService.deleteBarbeiro(id);

      if (!deleted) {
        return res.status(400).json({ message: "Erro ao deletar barbeiro" });
      }

      res.sendStatus(204);
    } catch (err) {
      console.error("Erro ao deletar barbeiro:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default barbeiroController;
