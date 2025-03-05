import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Input, 
  IconButton
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { FaFileContract, FaFileSignature } from "react-icons/fa6";
import logo from "../../assets/logo.png";
import img from "../../assets/manager.png";
import Souscription from '../contrat/Souscription';
import ListeContratsManager from '../contrat/ListeContratsManager';
import { CiBoxList } from "react-icons/ci";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Chat from '../Chat';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import DashboardGestion from "../DashbordGestion";
import FileImport from '../contrat/FileImport';
function Manager() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [etat, setEtat] = useState('');
  const [Matricule, setMatricule] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
 const [active, setActive] = useState(null);
  const handleOpen = () => setOpen(!open);


  

  useEffect(() => {
    // Fonction pour récupérer les informations du profil
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

    fetchProfile();
    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://51.83.69.195:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEtat(response.data.user.etat);
        }
      } catch (error) {
        console.error("Erreur lors de l'actualisation de l'état :", error);
      }
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
    
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

  // Logout function
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

  // Function to render the correct component based on state
  const renderComponent = () => {
    if (etat === 0) return null;
    switch (activeComponent) {
      case 'listeContrats':
        return <ListeContratsManager />;
        case 'Dashboard':
        return <DashboardGestion/>;
      case 'AjoutContrat':
        return <Souscription />;
        case 'Chat':
          return <Chat currentUser={{ matricule: Matricule, name: userName }} />;
          case 'Fiche':
        return <FileImport />;
      default:
        return <Souscription />;
    }
  };

 

  return (
    <div className="flex bg-white">
      {/* Sidebar */}
      <Card className="h-full min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">        {/* Logo */}
        <img
          className="object-cover w-auto h-24"
          src={logo}
          alt="Company Logo"
        />

          <div className="text-light-blue-900 pl-5 mb-4 pt-8 flex items-center space-x-2">
          <Typography variant="h6" className="flex items-center">
            <img className="object-cover w-auto h-12" src={img} alt="User" />
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

        {/* Menu List */}
        <List>
        <ListItem
            onClick={() => setActiveComponent('Dashboard')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
          <ListItem
            onClick={() => setActiveComponent('listeContrats')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5" />
            </ListItemPrefix>
            Consulter la liste des contrats
          </ListItem>

          <ListItem
            onClick={() => setActiveComponent('AjoutContrat')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <FaFileSignature className="h-5 w-5" />
            </ListItemPrefix>
            Ajouter un Contrat
          </ListItem>
          <ListItem
            onClick={() => setActiveComponent('Chat')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <FaFileSignature className="h-5 w-5" />
            </ListItemPrefix>
           Chat
          </ListItem>

          <ListItem
            onClick={() => setActiveComponent('Fiche')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <FaFileSignature className="h-5 w-5" />
            </ListItemPrefix>
           Fichier
          </ListItem>

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

      {/* Content Area */}
      <div className="flex-1 p-6">
        {renderComponent()}
      </div>
    </div>
  );
}

export default Manager;
