import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import frLocale from '@fullcalendar/core/locales/fr';
import Swal from 'sweetalert2';
// Fonction pour convertir une date au format "DD/MM/YYYY" ou "YYYY-MM-DD" en objet Date
const parseDate = (dateString) => {
  if (!dateString) return null;

  let parts;
  if (dateString.includes('/')) {
    parts = dateString.split('/');
    if (parts[2].length === 4) {
      // Format "DD/MM/YYYY"
      return new Date(parts[2], parts[1] - 1, parts[0]);
    } else if (parts[0].length === 4) {
      // Format "YYYY/MM/DD"
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  } else if (dateString.includes('-')) {
    parts = dateString.split('-');
    if (parts[0].length === 4) {
      // Format "YYYY-MM-DD"
      return new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      // Format "DD-MM-YYYY"
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
  }
  console.error("Date invalide :", dateString);
  return null;
};

const CalendarDevis = () => {

  const [devis, setDevis] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Nouveau modal pour afficher les détails
  const [selectedDevis, setSelectedDevis] = useState(null);  // Pour stocker les détails du devis sélectionné
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    dob: '',
    address: '',
    profession: '',
    devisDate: '',
    heure:'',
    cotisation: '',
    compagnie: '',
    effetDate: '',
    formulePropose: '',
    fraisDossier: '',
    niveauPropose: '',
    apporteurAffaire: '',
    commentaireAgent: '',
    ancienneMutuelle: '',
    
   
    
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
          setRole(response.data.user.role);
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

   // Fonction pour récupérer les devis depuis le backend
   const fetchDevis = async () => {
    try {
      const response = await axios.get('http://51.83.69.195:5000/api/devis-recup');
      
      const devisData = response.data
        .filter((devis) => {
          if (role === 'Direction') {
            return true; // Tous les devis
          } else if (role === 'Commerciale') {
            return devis.Commercial === userName; // Filtrer par devisCommercial
          }
          return false; // Si aucun rôle valide, ne rien retourner
        })
        .map((devis) => {
          // Récupération de la date (devisDate) et de l'heure (heure)
          const [year, month, day] = devis.devisDate.split('-'); // Décompose la date "yyyy-mm-dd"
          const [hours, minutes] = devis.heure ? devis.heure.split(':') : [0, 0]; // Décompose l'heure "HH:mm" si elle existe
  
          // Création d'un objet Date complet avec l'heure
          const eventDate = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes)); // Le mois commence à 0
  
          return {
            id: devis._id,
            title: `${devis.nom.toLocaleUpperCase()} ${devis.prenom.toLocaleUpperCase()}`,
            start: eventDate, // Utilisation de la date complète avec l'heure
            ...devis,
          };
        })
        .filter((devis) => devis.start);
  
      setDevis(devisData); // Met à jour les données de devis dans l'état
    } catch (error) {
      console.error('Erreur lors de la récupération des devis', error);
    }
  };
  
  useEffect(() => {
    fetchDevis();
  }, [role, userName]); // Déclenchement de l'effet lorsque role ou userName change
  

  const handleSelectEvent = (info) => {
    const selectedDevis = devis.find(d => d.id === info.event.id);
    setSelectedDevis(selectedDevis);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedDevis(null);
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDevis = async () => {
    const requiredFields = [
      'nom',
      'prenom',
      'telephone',
      'email',
      'dob',
      'address',
      'profession',
      'devisDate',
      'heure',
      'cotisation',
      'compagnie',
      'effetDate',
      'formulePropose',
      'fraisDossier',
      'niveauPropose',
      'ancienneMutuelle',
      'apporteurAffaire',
    ];
  
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: `Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`,
      });
      return;
    }
  
    try {
      const dataToSend = { ...formData, Commercial: userName }; // Ajout automatique de `userName` au champ `Commercial`
      const response = await fetch('http://51.83.69.195:5000/api/calend-devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du devis");
      }
  
      const result = await response.json();
      Swal.fire({
        icon: 'success',
        title: 'Ajout réussi',
        text: result.message,
      });
  
      // Recharger les devis après ajout
      fetchDevis();
  
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        dob: '',
        address: '',
        profession: '',
        devisDate: '',
        heure: '',
        cotisation: '',
        compagnie: '',
        effetDate: '',
        formulePropose: '',
        fraisDossier: '',
        niveauPropose: '',
        apporteurAffaire: '',
        commentaireAgent: '',
        ancienneMutuelle: '',
      });
  
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Une erreur est survenue lors de l'ajout du devis. Veuillez réessayer.",
      });
    }
  };
  
  
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
  }, [isModalOpen]);
  return (
    
    <div className="container mx-auto p-4 md:p-8">

      <h3 className="  lg:text-4xl font-bold text-left text-blue-gray-700 mb-4">Agenda des devis </h3>
     <div className='text-right' >
      <Button onClick={() => setIsModalOpen(true)} color="green" size="md">
        Ajouter un Devis  
      </Button>
      </div>
      <Dialog open={isModalOpen} handler={() => setIsModalOpen(false)} portal container={document.body}>
        <DialogHeader>Ajouter un Devis</DialogHeader>
        <DialogBody divider className="max-h-[60vh] overflow-y-auto">
          <form className="space-y-4">
            {/* Ligne Nom et Prénom */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            {/* Ligne Téléphone et Email */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            {/* Ligne Date de naissance et Adresse */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Date de Naissance</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>

            {/* Ligne Profession et Date de Devis */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>
            {/* Ligne cotisation et Date de Devis */}


            {/* Ligne cotisation et Date de Devis */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Date du Devis</label>
                <input
                  type="date"
                  name="devisDate"
                  value={formData.devisDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">heure</label>
                <input
                  type="time"
                  name="heure"
                  value={formData.heure}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>

            </div>

            <div className="flex space-x-4">
            <div className="flex-1">
                <label className="text-sm font-medium">Montant vp</label>
                <input
                  type="number"
                  name="cotisation"
                  value={formData.cotisation}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Compagnie</label>
                <select
                  id="compagnie"
                  name="compagnie"
                  value={formData.compagnie}
                  onChange={handleChange}
                  className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"

                >
                  <option value="">Sélectionnez la compagnie</option>
                  <option value="Néolyane">Néoliane</option>
                  <option value="Assurema">Assurema</option>
                  <option value="Alptis">Alptis</option>
                  <option value="April">April</option>
                  <option value="Malakoff Humanis">Malakoff Humanis</option>
                  <option value="Cegema">Cegema</option>
                  <option value="Swisslife">Swisslife</option>
                  <option value="Soly Azar">Soly Azar</option>
                  <option value="Zenio">Zenio</option>
                 </select>
              </div>
            </div>

            <div className="flex space-x-4">
            <div className="flex-1">
                <label className="text-sm font-medium">Date d'effet</label>
                <input
                  type="date"
                  name="effetDate"
                  value={formData.effetDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Frais de dossier</label>
                <input
                  type="number"
                  name="fraisDossier"
                  value={formData.fraisDossier}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
            </div>
            <div className="flex space-x-4">
            <div className="flex-1">
                <label className="text-sm font-medium">formule Proposé</label>
                <input
                  type="text"
                  name="formulePropose"
                  value={formData.formulePropose}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Niveau proposé</label>
                <input
                  type="text"
                  name="niveauPropose"
                  value={formData.niveauPropose}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>

          </div>
          <div className="flex space-x-4">
          <div className="flex-1">
                <label className="text-sm font-medium">Ancienne mutuelle</label>
                <input
                  type="text"
                  name="ancienneMutuelle"
                  value={formData.ancienneMutuelle}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full"
                />
              </div>
          <div className="flex-1">
          <label className="text-sm font-medium">Apporteur d'affaire</label>
                <select
                  id="apporteurAffaire"
                  name="apporteurAffaire"
                  value={formData.apporteurAffaire}
                  onChange={handleChange}
                  className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
                  >
                    <option value=""></option>
                    <option value="Cyrine Ben Aicha">Cyrine Ben Aicha</option>
                    <option value="Sihem Selemi">Sihem Selemi</option>
                    <option value="Hajer Askri">Hajer Askri</option>
                    <option value="Rim Dabebi ">Rim Dabebi </option>
                    <option value="Eya Ben Jabra">Eya Ben Jabra</option>
                    <option value="Rihab Kouki">Rihab Kouki</option>
                    <option value="Leads">Leads </option>
                   
                  </select>
          </div>
          </div>

          <div >
          <label className="text-sm font-medium">Commentaire</label>
          <textarea
                  type="text"
                  name="commentaireAgent"
                  value={formData.commentaireAgent}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded mt-1 w-full "
                  rows="4"
          ></textarea>
          </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setIsModalOpen(false)} className="mr-2">
            Annuler
          </Button>
          <Button color="green" onClick={handleAddDevis}>
            Ajouter
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-6">
      <FullCalendar
  locale={frLocale}
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  weekends={true}
  events={devis}
  eventClick={handleSelectEvent}  // Capture le clic sur l'événement (devis)
  height="auto"
  contentHeight="auto"
  aspectRatio={1.35}
  buttonText={{
    today: "Aujourd'hui",
  }}
  customButtons={{
    listDevis: {
      text: 'Liste des devis',
      click: () => {
        // Action à effectuer lorsqu'on clique sur le bouton "Liste des devis"
        // Par exemple, vous pouvez ouvrir un modal ou rediriger vers une page spécifique
        Swal.fire({
          title: 'Liste des devis',
          text: 'Ici vous pouvez afficher la liste des devis.',
          icon: 'info',
        });
      },
    },
  }}
  headerToolbar={{
    left: 'prev,next today', // Ajoutez 'listDevis' ici pour afficher le bouton
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay',

  }}
/>

      </div>
        {/* Modal de détails du devis */}
        {selectedDevis && (
        <Dialog
          open={Boolean(selectedDevis)}
          handler={handleCloseDetailsModal}
          className="relative bg-white m-4 rounded-lg shadow-2xl text-blue-gray-500 "
          style={{
          opacity: isDetailsModalOpen ? 1 : 0, // Affiche la modal si `isDetailsModalOpen` est `true`
          transform: isDetailsModalOpen ? 'translateY(0)' : 'translateY(-50px)', // Positionne la modal correctement
          transition: 'opacity 0.3s ease, transform 0.3s ease' // Ajoute une transition
          }}
        >
        <DialogHeader>Détails du Devis</DialogHeader>
        <DialogBody divider className="max-h-96 overflow-y-auto">
        <div>
       <h3 className="font-semibold">Agent: </h3>
       <p>{selectedDevis.Commercial}</p>
      </div>
      <div>
      <h3 className="font-semibold">Nom et Prénom:</h3>
      <p >{selectedDevis.nom.toUpperCase()}{selectedDevis.prenom.toUpperCase()}</p>
      </div>
      <div>
       <h3 className="font-semibold">Téléphone: </h3>
       <p>{selectedDevis.telephone}</p>
      </div>
      <div>
      <h3 className="font-semibold">Email:</h3>
      <p>{selectedDevis.email}</p>
      </div>
      <div>
      <h3 className="font-semibold">Profession:</h3>
      <p>{selectedDevis.profession}</p>
      </div>
      <div>
      <h3 className="font-semibold">Date du Devis:</h3>
      <p>{selectedDevis.devisDate}</p>
      </div>
      <div>
      <h3 className="font-semibold">Heure:</h3>
      <p>{selectedDevis.heure}</p>
      </div>
      <div>
      <h3 className="font-semibold">Compagnie:</h3>
      <p>{selectedDevis.compagnie}</p>
      </div>
      <div>
      <h3 className="font-semibold">Formule Proposée:</h3>
      <p>{selectedDevis.formulePropose}</p>
      </div>
      <div>
      <h3 className="font-semibold">Montant VP:</h3>
      <p>{selectedDevis.cotisation}</p>
      </div>
      <div>
      <h3 className="font-semibold">Apporteur d'affaire:</h3>
      <p>{selectedDevis.apporteurAffaire}</p>
      </div>
      <div>
      <h3 className="font-semibold">Commentaire de l'Agent:</h3>
      <p>{selectedDevis.commentaireAgent}</p>
      </div>
      </DialogBody>

      <DialogFooter>
      <Button variant="text" color="red" onClick={handleCloseDetailsModal} className="mr-2">
       Fermer
      </Button>
    </DialogFooter>
    </Dialog>
)}


    </div>
  );
};

export default CalendarDevis;
