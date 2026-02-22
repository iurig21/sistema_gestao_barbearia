import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AuthService = {
  isPasswordCorrect: (password, storedPassword) => {
    try {
      return bcrypt.compareSync(password, storedPassword);
    } catch (err) {
      throw err;
    }
  },

  generateToken: (id, role) => {
    try {
      const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return token;
    } catch (err) {
      throw err;
    }
  },

  hashPassword: (password) => {
    try {
      return bcrypt.hashSync(password);
    } catch (err) {
      throw err;
    }
  },
};

export default AuthService;
