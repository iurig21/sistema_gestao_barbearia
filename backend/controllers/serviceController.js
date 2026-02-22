import ServiceService from "../services/serviceService.js";

const serviceController = {
  getServices: async (_, res) => {
    try {
      const services = await ServiceService.getServices();

      res.status(200).json(services);
    } catch (err) {
      console.error("Error fetching services:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createService: async (req, res) => {
    try {
      const { nome, descricao, preco, imagem } = req.body;

      if (!nome.trim() || !imagem.trim() || !preco) {
        return res
          .status(400)
          .json({ message: "O nome, preco e imagem são obrigatórios" });
      }

      const service = await ServiceService.createService({
        nome,
        descricao,
        preco,
        imagem,
      });

      if (!service) {
        return res.status(400).json({ message: "Erro a criar serviço" });
      }

      res.status(201).json(service);
    } catch (err) {
      console.error("Error creating a new service:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateService: async (req, res) => {
    try {
      const { newName, newDescription, newPrice, newImage } = req.body;
      const { id } = req.params;

      const updated = await ServiceService.updateService({
        id,
        newName,
        newDescription,
        newPrice,
        newImage,
      });

      if (!updated) {
        return res.status(400).json({ message: "Erro ao atualizar serviço" });
      }

      res.sendStatus(204);
    } catch (err) {
      console.error("Error updating service:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteService: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.trim()) {
        return res.status(400).json({ message: "Service ID not provided" });
      }

      const deleted = await ServiceService.deleteService(id);

      if (!deleted) {
        return res.status(400).json({ message: "Error deleting service" });
      }

      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting service:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default serviceController;
