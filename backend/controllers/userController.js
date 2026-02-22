import UserService from "../services/userService.js";

const userController = {
  getUsers: async (_, res) => {
    try {
      const users = await UserService.getUsers();

      res.status(200).json(users);
    } catch (err) {
      console.error("Erro ao retornar utilizadores:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.trim()) {
        return res
          .status(400)
          .json({ message: "O id do usuário não foi providenciado" });
      }

      const UserSuccesfullyDeleted = await UserService.deleteUser(id);

      if (!UserSuccesfullyDeleted) {
        return res.status(400).json({ message: "Erro ao excluir usuário" });
      }

      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Internal server errror" });
    }
  },
};

export default userController;
