import GoogleCalendarService from "../services/googleCalendarService.js";

const googleController = {
  getAuthUrl: async (req, res) => {
    try {
      const { id: userId } = req.user;
      const url = GoogleCalendarService.getAuthUrl(userId);
      res.status(200).json({ url });
    } catch (err) {
      console.error("Error generating Google auth URL:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  handleCallback: async (req, res) => {
    try {
      const { code, state: userId } = req.query;

      if (!code || !userId) {
        return res.redirect("http://localhost:5173/profile?google=error");
      }

      const tokens = await GoogleCalendarService.getTokensFromCode(code);
      await GoogleCalendarService.saveTokens(userId, tokens);

      res.redirect("http://localhost:5173/profile?google=success");
    } catch (err) {
      console.error("Error handling Google callback:", err);
      res.redirect("http://localhost:5173/profile?google=error");
    }
  },

  getStatus: async (req, res) => {
    try {
      const { id: userId } = req.user;
      const tokens = await GoogleCalendarService.getTokens(userId);
      res.status(200).json({ connected: !!tokens });
    } catch (err) {
      console.error("Error checking Google status:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  disconnect: async (req, res) => {
    try {
      const { id: userId } = req.user;
      await GoogleCalendarService.removeTokens(userId);
      res.status(200).json({ message: "Google Calendar desconectado" });
    } catch (err) {
      console.error("Error disconnecting Google:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default googleController;
