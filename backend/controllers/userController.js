import UserService from "../services/userService.js";
import AuthService from "../services/authService.js";

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

  updateUser: async (req, res) => {
    try {
      const { newPassword, newTelefone, newMorada, newPhoto, newDoc } = req.body;
      const { id: userId } = req.params;

      if (!newPassword && !newTelefone && !newMorada && !newPhoto && !newDoc) {
        return res.status(400).json({ message: "No new info provided" });
      }

      const hashedPassword = newPassword
        ? AuthService.hashPassword(newPassword)
        : null;

      const userInfoUpdated = await UserService.updateUser({
        userId,
        newPassword: hashedPassword,
        newTelefone,
        newMorada,
        newPhoto,
        newDoc,
      });

      if (!userInfoUpdated) {
        return res.status(400).json({ message: "Error updating user info" });
      }

      res.status(200).json({ message: "User info updated successfully" });
    } catch (err) {
      console.error("Error changing user info", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default userController;
