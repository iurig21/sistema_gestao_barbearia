import AppointmentService from "../services/appointmentService.js";
import GoogleCalendarService from "../services/googleCalendarService.js";
import { isDateValid, isValidTime } from "../utils/index.js";

const appointmentController = {
  getAppointments: async (req, res) => {
    try {
      const { id: userID } = req.user;

      const appointments =
        await AppointmentService.getAppointmentsByUser(userID);

      res.status(200).json(appointments);
    } catch (err) {
      console.error("Error fetching appointments", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllAppointments: async (_, res) => {
    try {
      const appointments = await AppointmentService.getAllAppointments();

      res.status(200).json(appointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getBookedSlots: async (req, res) => {
    try {
      const { date } = req.params;
      const { barbeiroId } = req.query;

      if (!date || !isDateValid(date)) {
        return res.status(400).json({ message: "Data inválida" });
      }

      const bookedHours = await AppointmentService.getBookedSlots(
        date,
        barbeiroId,
      );

      res.status(200).json(bookedHours);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createAppointment: async (req, res) => {
    try {
      const { id: userID } = req.user;

      if (!req.user.email_verificado || !req.user.telefone_verificado) {
        return res.status(403).json({
          message: "É necessário verificar o seu email e telefone antes de fazer uma marcação.",
        });
      }

      const { servicoID, data, hora, barbeiroID } = req.body;

      if (!data.trim() || !hora.trim() || !barbeiroID) {
        return res
          .status(400)
          .json({ message: "A data, hora e barbeiro são obrigatórios" });
      }

      if (!isDateValid(data)) {
        return res.status(400).json({ message: "A data está inválida" });
      }

      if (new Date(data) < new Date()) {
        return res.status(400).json({
          message: "A data de marcação não pode ser anterior à data atual.",
        });
      }

      if (!isValidTime(hora)) {
        return res.status(400).json({ message: "Hora inválida" });
      }

      const hours = hora.split(":").map(Number)[0];
      if (hours < 9 || hours >= 18) {
        return res
          .status(400)
          .json({ message: "O horário deve estar entre 09:00 e 18:00" });
      }

      const isAvailable = await AppointmentService.checkAvailability(
        data,
        hora,
        barbeiroID,
      );

      if (!isAvailable) {
        return res.status(400).json({ message: "Sem disponibilidade" });
      }

      const appointment = await AppointmentService.createAppointment({
        userID,
        servicoID,
        data,
        hora,
        barbeiroID,
      });

      if (!appointment) {
        return res.status(400).json({ message: "Erro ao criar marcação" });
      }

      try {
        const tokens = await GoogleCalendarService.getTokens(userID);
        if (tokens) {
          const serviceName = req.body.servicoNome || "Barbearia";
          const barbeiroName = req.body.barbeiroNome || "Barbeiro";

          const calendarEvent = await GoogleCalendarService.createCalendarEvent(userID, {
            summary: `Barbearia - ${serviceName}`,
            description: `Serviço: ${serviceName}\nBarbeiro: ${barbeiroName}`,
            date: data,
            time: hora,
          });

          if (calendarEvent?.id) {
            await AppointmentService.saveGoogleEventId(appointment.id, calendarEvent.id);
          }
        }
      } catch (calendarErr) {
        console.error("Google Calendar event creation failed (non-blocking):", calendarErr.message);
      }

      res.status(201).json(appointment);
    } catch (err) {
      console.error("Error creating an appointment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteAppointment: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.trim()) {
        return res.status(400).json({ message: "AppointmentID not provided" });
      }

      const appointment = await AppointmentService.getAppointmentById(id);

      if (appointment?.google_event_id) {
        try {
          await GoogleCalendarService.deleteCalendarEvent(
            appointment.user_id,
            appointment.google_event_id,
          );
        } catch (calendarErr) {
          console.error("Google Calendar event deletion failed (non-blocking):", calendarErr.message);
        }
      }

      const deleted = await AppointmentService.deleteAppointment(id);

      if (!deleted) {
        return res.status(400).json({ message: "Erro ao deletar marcação" });
      }

      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting appointment:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default appointmentController;
