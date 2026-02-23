import { google } from "googleapis";
import sql from "mssql";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

const GoogleCalendarService = {
  getAuthUrl: (userId) => {
    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      state: String(userId),
    });
  },

  getTokensFromCode: async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  },

  saveTokens: async (userId, tokens) => {
    await sql.query`
      UPDATE utilizadores 
      SET google_access_token = ${tokens.access_token}, 
          google_refresh_token = ${tokens.refresh_token}
      WHERE id = ${userId}
    `;
  },

  getTokens: async (userId) => {
    const { recordset } = await sql.query`
      SELECT google_access_token, google_refresh_token 
      FROM utilizadores 
      WHERE id = ${userId}
    `;

    if (!recordset[0]?.google_access_token) return null;

    return {
      access_token: recordset[0].google_access_token,
      refresh_token: recordset[0].google_refresh_token,
    };
  },

  removeTokens: async (userId) => {
    await sql.query`
      UPDATE utilizadores 
      SET google_access_token = NULL, 
          google_refresh_token = NULL
      WHERE id = ${userId}
    `;
  },

  createCalendarEvent: async (userId, { summary, description, date, time }) => {
    const tokens = await GoogleCalendarService.getTokens(userId);
    if (!tokens) return null;

    oauth2Client.setCredentials(tokens);

    oauth2Client.on("tokens", async (newTokens) => {
      if (newTokens.refresh_token) {
        await GoogleCalendarService.saveTokens(userId, {
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
        });
      } else {
        await sql.query`
          UPDATE utilizadores 
          SET google_access_token = ${newTokens.access_token}
          WHERE id = ${userId}
        `;
      }
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const [hours, minutes] = time.split(":").map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    const event = {
      summary,
      description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Europe/Lisbon",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Europe/Lisbon",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      return response.data;
    } catch (err) {
      console.error("Error creating Google Calendar event:", err.message);
      if (err.code === 401) {
        await GoogleCalendarService.removeTokens(userId);
      }
      return null;
    }
  },
};

export default GoogleCalendarService;
