import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, addDays, startOfWeek  } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
const Agenda = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(''); 
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [newEvent, setNewEvent] = useState({
    title: "",
    subtitle: "",
    time: "",
    date: format(selectedDay, "yyyy-MM-dd"),
    participants: [],
    ajoutePar: userName // Ajouter le champ "ajoutePar"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://51.83.69.195:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(response.data.user.name);
          setUserRole(response.data.user.role);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };
    fetchProfile();
  }, [navigate]);

  const [eventToEdit, setEventToEdit] = useState(null);

  const availableParticipants = [
    { id: 1003, name: "Faten" },
    { id: 1004, name: "Hanene" },
    { id: 1005, name: "Anis" },
    { id: 1006, name: "Basma" },
    { id: 1007, name: "Felix" },
    { id: 1008, name: "Saliha" },
    { id: 1009, name: "Sabrine" },
    { id: 1010, name: "Amel" },
    { id: 1011, name: "Sami" },
    { id: 1012, name: "Mohamed" },
    { id: 1013, name: "Najeh" },
    { id: 1014, name: "Aymen" },
    { id: 1015, name: "Cyrine" },
    { id: 1016, name: "Refka" },
    { id: 1017, name: "Dhekra" },
    { id: 1018, name: "Olfa" },
    { id: 1019, name: "Imen Bouazizi" },
    { id: 1020, name: "Sihem Selemi" },
    { id: 1021, name: "Hajer Askri" },
    { id: 1022, name: "Rim Dabebi" },
    { id: 1023, name: "Rihab Kouki" },
    { id: 1024, name: "Eric" },
    { id: 1025, name: "Khouloud Khalfallah" },
    { id: 1026, name: "Eya Ben Jbara" },
  ];

  useEffect(() => {
    axios.get("http://51.83.69.195:5000/api/events")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error(error));
  }, []);

  const startDate = startOfWeek(selectedDay, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }).map((_, idx) => addDays(startDate, idx));
  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const handlePreviousWeek = () => setSelectedDay(addDays(selectedDay, -1));
  const handleNextWeek = () => setSelectedDay(addDays(selectedDay, 1));

  const handleAddEvent = () => {
    const matchedParticipant = availableParticipants.find((p) => p.name === userName);
     const initialParticipants = matchedParticipant ? [matchedParticipant] : [];

    setNewEvent({
      title: "",
      subtitle: "",
      time: "",
      date: format(selectedDay, "yyyy-MM-dd"),
      participants: initialParticipants,
      ajoutePar: userName // Enregistre l'utilisateur actuel en tant qu'ajouteur
    });
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleSaveEvent = () => {
    if (isEditing) {
      axios.put(`http://51.83.69.195:5000/events/${eventToEdit._id}`, newEvent)
        .then((response) => {
          setEvents(events.map((e) => (e._id === eventToEdit._id ? response.data : e)));
          setIsEditing(false);
        })
        .catch((error) => console.error(error));
    } else {
      axios.post("http://51.83.69.195:5000/events", newEvent)
        .then((response) => {
          setEvents([...events, response.data]);
          setIsAdding(false);
        })
        .catch((error) => console.error(error));
    }
    setNewEvent({ title: "", subtitle: "", time: "", date: format(selectedDay, "yyyy-MM-dd"), participants: [], ajoutePar: userName });
  };

  const handleEditEvent = (event) => {
    setIsEditing(true);
    setIsAdding(true);
    setNewEvent(event);
    setEventToEdit(event);
  };

  const handleDeleteEvent = (id) => {
    axios.delete(`http://51.83.69.195:5000/events/${id}`)
      .then(() => setEvents(events.filter((event) => event._id !== id)))
      .catch((error) => console.error(error));
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setNewEvent({
      title: "",
      subtitle: "",
      time: "",
      date: format(selectedDay, "yyyy-MM-dd"),
      participants: [],
      ajoutePar: userName
    });
  };

  const handleSelectParticipant = (e, participant) => {
    if (e.target.checked) {
      setNewEvent((prev) => ({
        ...prev,
        participants: [...prev.participants, participant]
      }));
    } else {
      setNewEvent((prev) => ({
        ...prev,
        participants: prev.participants.filter((p) => p.id !== participant.id)
      }));
    }
  };


// Filtre des événements visibles
const visibleEvents = events.filter((event) => 
  userRole === 'Direction' || // Vérifie si l'utilisateur a le rôle 'Direction'
  event.ajoutePar === userName || 
  event.participants.some((p) => p.name === userName)
);


  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-700">Agenda</h2>
        <div className="flex items-center space-x-4">
          <button onClick={handlePreviousWeek} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">{"<"}</button>
          <button onClick={handleAddEvent} className="p-2 px-4 bg-green-600 text-white rounded-lg shadow">Ajouter un RDV</button>
          <button onClick={handleNextWeek} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">{">"}</button>
        </div>
      </div>

      <div className="flex justify-between mb-8">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`flex flex-col items-center p-4 w-16 rounded-lg transition ${
              formatDate(day) === formatDate(selectedDay)
                ? "bg-blue-gray-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setSelectedDay(day)}
          >
            <div className="font-bold text-lg">{format(day, "E")}</div>
            <div className="text-sm">{format(day, "dd MMM")}</div>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {visibleEvents
          .filter((event) => event.date === formatDate(selectedDay))
          .map((event) => (
            <div key={event._id} className="p-6 bg-gray-50 rounded-lg shadow-lg transition hover:bg-indigo-50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-700 pr-8">Heure du rendez-vous: <span className="text-lg font-semibold text-blue-500">{event.time}</span></p>
              </div>
              <p className="text-gray-600 text-left mb-2">{event.subtitle}</p>

              <div className="flex space-x-4 items-center">
                 {event.participants.map((participant, idx) => (
                  
                 <p key={idx} className="text-indigo-700 font-medium"> 
              {participant.name}
            </p>
                ))}
               
        
               <div className="flex pl-96 space-x-2 mt-2">
                 <button onClick={() => handleEditEvent(event)} className="text-blue-600">✏️</button>
                 <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600">
                 <RiDeleteBin6Line className="h-6 w-6" />
                 </button>
            
              </div>
              </div>
            </div>
          ))}
      </div>
      {/* Formulaire de création ou d'édition de RDV */}
      {isAdding && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{isEditing ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</h3>
         
          <label className=' text-sm '>Heure du rendez-vous : </label>
          <input
           type="time"
           value={newEvent.time}
           onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
           className="w-full p-2 mb-4 border rounded"
          />
          
          <label className=' text-sm '>Titre : </label>
          <input
            type="text"
            placeholder="Titre"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className=' text-sm '>Paragraphe : </label>
          <textarea
            placeholder="Pargraphe"
            value={newEvent.subtitle}
            onChange={(e) => setNewEvent({ ...newEvent, subtitle: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Participants:</h4>
            <div className="flex flex-wrap">
              {availableParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center mb-2 w-1/4">
                  <input
                    type="checkbox"
                    id={`participant-${participant.id}`}
                    value={participant.id}
                    checked={newEvent.participants.some((p) => p.id === participant.id)}
                    onChange={(e) => handleSelectParticipant(e, participant)}
                    disabled={participant.name === userName} // Désactive la case pour le participant correspondant à `userName`
                  />
                  <label htmlFor={`participant-${participant.id}`} className="ml-2">
                    {participant.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSaveEvent} className="px-4 py-2 bg-green-500 hover:bg-green-800 text-white rounded-lg">
            {isEditing ? "Enregistrer les modifications" : "Ajouter le rendez-vous"}
          </button>
          <button onClick={handleCancel} className="px-4 py-2 bg-red-400 hover:bg-red-700 text-white rounded-lg">
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default Agenda;