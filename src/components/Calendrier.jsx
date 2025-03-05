import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import Select from "react-select";
import frLocale from '@fullcalendar/core/locales/fr';
const Calendrier = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentView, setCurrentView] = useState("dayGridMonth"); // Vue actuelle
  // Charger les rendez-vous depuis le backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("/api/appointments");
        const formattedEvents = data.map((appointment) => ({
          id: appointment._id,
          title: appointment.title,
          start: appointment.date,
          subtitle: appointment.subtitle,
          time: appointment.time,
          users: appointment.users,
        }));
        setAppointments(formattedEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous :", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/usersapp");
        setUsers(data.map((user) => ({ value: user._id, label: user.name })));
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };
    fetchAppointments();
    fetchUsers();
  }, []);

  // Sauvegarder ou modifier un rendez-vous
  const saveAppointment = async (appointment) => {
    try {
      if (appointment.id) {
        // Modification
        const { data } = await axios.put(`/api/appointments/${appointment.id}`, {
          title: appointment.title,
          date: appointment.start,
          subtitle: appointment.subtitle,
          time: appointment.time,
          users: selectedUsers.map((user) => user.value),
        });
        setAppointments((prev) =>
          prev.map((evt) => (evt.id === appointment.id ? { ...evt, ...data } : evt))
        );
      } else {
        // Ajout
        const { data } = await axios.post("/api/appointments", {
          title: appointment.title,
          date: appointment.start,
          subtitle: appointment.subtitle,
          time: appointment.time,
          users: selectedUsers.map((user) => user.value),
        });
        setAppointments((prev) => [...prev, { ...data, start: data.date }]);
      }
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  // Fermer la modale
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedUsers([]); // Réinitialiser les utilisateurs sélectionnés
  };


  return (
    <div className="px-4 pt-4 ">

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        events={appointments}
        locale={frLocale}
        eventClick={(info) => {
          setSelectedEvent({
            id: info.event.id,
            title: info.event.title,
            start: info.event.startStr,
            subtitle: info.event.extendedProps.subtitle,
            time: info.event.extendedProps.time,
          });
          setSelectedUsers(
            info.event.extendedProps.users?.map((user) => ({
              value: user._id,
              label: user.name,
            })) || []
          );
          setIsModalOpen(true);
        }}
        dateClick={(info) => {
          setSelectedEvent({ title: "", start: info.dateStr, subtitle: "" , time:"" });
          setSelectedUsers([]);
          setIsModalOpen(true);
        }}
        editable={true}
        headerToolbar={{
          left: 'prev,next today', // Ajoutez 'listDevis' ici pour afficher le bouton
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
      
        }}
      
      />

      {/* Modale */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-96 relative z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {selectedEvent?.id ? "Modifier" : "Ajouter"} un rendez-vous
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveAppointment(selectedEvent);
              }}
            >
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Titre</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={selectedEvent?.title || ""}
                  onChange={(e) =>
                    setSelectedEvent((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Heure</label>
                <input
                  type="time"
                  className="w-full border rounded px-3 py-2"
                  value={selectedEvent?.time || ""}
                  onChange={(e) =>
                    setSelectedEvent((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Description
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={selectedEvent?.subtitle || ""}
                  onChange={(e) =>
                    setSelectedEvent((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  Participants
                </label>
                <Select
                  isMulti
                  options={users}
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  placeholder="Participants..."
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Sauvegarder
              </button>
              <button
                type="button"
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendrier;
