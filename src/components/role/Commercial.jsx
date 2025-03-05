import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Badge,
} from "@material-tailwind/react";
import { IoIosNotifications } from "react-icons/io";
import { GiNotebook } from "react-icons/gi";
import { CiBoxList } from "react-icons/ci";
import { FaFileSignature } from "react-icons/fa6";
import { PowerIcon } from "@heroicons/react/24/solid";
import { MdOutlinePriceChange } from "react-icons/md";
import { IoCalendarNumber } from "react-icons/io5";
import { BsChatRightTextFill } from "react-icons/bs";
import logo from "../../assets/logo.png";
import img from "../../assets/user.png";
import ListeContratsComm from '../contrat/ListeContratsComm';
import Souscription from '../contrat/Souscription';
import Devis from '../contrat/Devis';
import ListeDevisComm from '../contrat/ListeDevisComm';
import Agenda from "../Agenda";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { FaFileLines } from "react-icons/fa6";
import BlocNotes from '../BlocNotes';
import CalendarDevis from '../CalendarDevis';
import Chat from '../Chat';
import FileImport from '../contrat/FileImport';


function Commercial() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [etat, setEtat] = useState('');
  const [Matricule, setMatricule] = useState('');
  const [contratUpdates, setContratUpdates] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  const handleOpen = () => setOpen(!open);

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
          setEtat(response.data.user.etat); 
          setMatricule(response.data.user.matricule);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };

    const fetchContratUpdates = async () => {
      try {
        const response = await axios.get('http://51.83.69.195:5000/api/contrat-updates');
        setContratUpdates(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des mises à jour :", error);
      }
    };
  
    const fetchAllData = () => {
      fetchProfile();
      fetchContratUpdates();
    };
  
    fetchAllData(); // Appel initial pour récupérer les données au chargement
  
    const intervalId = setInterval(fetchAllData, 5000); // Appel toutes les 5 secondes
  
    return () => clearInterval(intervalId); // Nettoyage à la désactivation du composant
  }, [navigate]);

  const handlePointage = async (type) => {
    try {
      const response = await axios.post('http://51.83.69.195:5000/api/pointage/pointage', {
        matricule: Matricule,
        name: userName,
        type: type,  
      });
      setActive(type);
      alert(response.data.message);
    } catch (error) {
      console.error('Erreur lors du pointage:', error);
    }
  };

  const renderUpdatedFields = () => {
    return contratUpdates.map((update, index) => (
      <div key={index} className="mb-4 m-14">
        <ul>
          {Object.keys(update.updatedFields).map((field, idx) => (
            <li key={idx}>
              <strong className='text-blue-800'>{field}</strong> : 
              <span> Ancien - {update.updatedFields[field].old} </span>
              <span> | Nouveau - {update.updatedFields[field].new}</span>
            </li>
          ))}
        </ul>
        <Typography className='text-right text-lg text-black ' variant="h6">
          Modifié le {new Date(update.modificationDate).toLocaleDateString()}
        </Typography>
      </div>
    ));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

   // Fonction pour gérer le changement de statut
const handleStatusChange = async () => {
  const newStatus = isOnline ? "hors ligne" : "en ligne"; // Définir le statut sous forme de texte
  setIsOnline(!isOnline); // Changer l'état local du bouton

  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      await axios.post(
        "http://51.83.69.195:5000/api/status",
        { username: userName, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
  }
};
  const renderComponent = () => {
    if (etat === 0) return null; // Désactive le rendu des composants si etat est égal à 0
    switch (activeComponent) {
      case 'listeContrats':
        return <ListeContratsComm />;
      case 'AjoutContrat':
        return <Souscription />;
      case 'AjoutDevis':
        return <Devis />;
      case 'listeDevis':
        return <ListeDevisComm />;
        case 'Add-devis':
          return <CalendarDevis />;

        case 'Chat':
           return <Chat currentUser={{ matricule: Matricule, name: userName }} />;

        case 'BlocNote':
          return <BlocNotes />;
          case 'ImportFile':
            return <FileImport />;
      default:
        return <Souscription />;
    }
  };
  return (
    <div className="flex">
      <Card className="h-full min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">
      <img
          className="object-cover w-auto h-24"
          src={logo}
          alt="Company Logo"
        />
        <div className="text-light-blue-900 pl-5 mb-4 pt-8 flex items-center space-x-2">
          <Typography variant="h6" className="flex items-center">
            <Badge content={contratUpdates.length} overlap="circular">
              <button onClick={handleOpen} disabled={etat === 0}>
                <img className="object-cover w-auto h-12" src={img} alt="User" />
              </button>
            </Badge>
            {userName}
          </Typography>
          </div>
            <div className="flex flex-col space-y-3">
                  <Button
                    className={active === "En ligne" ? "bg-green-500" : "bg-gray-900"}
                    onClick={() => handlePointage("En ligne")}
                  >
                    En ligne
                  </Button>
                  <Button
                    className={active === "pause" ? "bg-orange-500" : "bg-gray-900"}
                    onClick={() => handlePointage("pause")}
                  >
                    Pause
                  </Button>
                  <Button
                    className={active === "retour de pause" ? "bg-blue-500" : "bg-gray-900"}
                    onClick={() => handlePointage("retour de pause")}
                  >
                    Retour de Pause
                  </Button>
                  <Button
                    className={active === "Hors ligne" ? "bg-red-500" : "bg-gray-900"}
                    onClick={() => handlePointage("Hors ligne")}
                  >
                    Hors ligne
                  </Button>
                </div>
<List>
  {['listeContrats', 'AjoutContrat', 'Add-devis', 'listeDevis', 'Agenda', 'Chat' , 'BlocNote' ,'ImportFile'].map((item, index) => (
    <ListItem
      key={index}
      onClick={() => setActiveComponent(item)}
      className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
    >
      <ListItemPrefix>
        {index === 0 ? <CiBoxList className="h-5 w-5" />
          : index === 1 ? <FaFileSignature className="h-5 w-5" />
          : index === 2 ? <MdOutlinePriceChange className="h-5 w-5" />
          : index === 3 ? <CiBoxList className="h-5 w-5" />
          : index === 4 ? <IoCalendarNumber className="h-5 w-5" />
          : index === 5 ? <BsChatRightTextFill className="h-5 w-5" />
          : index === 6 ? <FaFileLines className="h-5 w-5" />
          : <GiNotebook className="h-5 w-5" />} {/* Icône Bloc Notes */}
      </ListItemPrefix>
      {index === 0 ? 'Liste des contrats'
        : index === 1 ? 'Souscription'
        : index === 2 ? 'Devis'
        : index === 3 ? 'Liste des devis'
        : index === 4 ? 'Agenda'
        : index === 5 ? 'Chat'
        : index === 6? 'Bloc Notes'

        : 'Fichiers'} {/* Nom Bloc Notes */}
    </ListItem>
  ))}
  <ListItem
    onClick={handleLogout}
    className="hover:bg-blue-600 text-white"
  >
    <ListItemPrefix>
      <PowerIcon className="h-5 w-5" />
    </ListItemPrefix>
    Se déconnecter
  </ListItem>
</List>
      </Card>
      <div className="flex-1 p-6">
        {renderComponent()}
      </div>
      <Dialog open={open} handler={handleOpen} className="max-h-[75vh]">
        <DialogHeader className='text-green-700'> <IoIosNotifications/> Notifications</DialogHeader>
        <DialogBody className="overflow-y-auto max-h-[50vh]">
          {contratUpdates.length > 0 ? (
            renderUpdatedFields()
          ) : (
            <Typography>Aucune modification récente.</Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Fermer</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
export default Commercial;