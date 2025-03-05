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
import { IoCalendarNumber } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { PowerIcon } from "@heroicons/react/24/solid";
import logo from "../../assets/logo.png";
import img from "../../assets/user.png";
import SouscriptionEnergie from './SouscriptionEnergie';
import ListeEnergieAgent from './ListeEnergieAgent';
import ChatEnergie from '../ChatEnergie';

function AgentEnergie() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [contratUpdates, setContratUpdates] = useState([]);
  const [open, setOpen] = useState(false);
  const [Matricule, setMatricule] = useState('');
  const navigate = useNavigate();
  const [etat, setEtat] = useState('');
  const [active, setActive] = useState(null);
  const handleOpen = () => setOpen(!open);


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

    // Fonction pour récupérer les modifications des contrats
    const fetchContratUpdates = async () => {
      try {
        const response = await axios.get('http://51.83.69.195:5000/api/contrat-updates');
        setContratUpdates(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des mises à jour :", error);
      }
    };

    fetchProfile();
    
    fetchContratUpdates();

    // Actualisation toutes les 20 secondes
    const intervalId = setInterval(() => {
      fetchProfile(); // Rafraîchir les informations du profil
    }, 20000); // 20000 ms = 20 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Fonction pour formater et afficher les champs modifiés
  const renderUpdatedFields = () => {
    return contratUpdates.map((update, index) => (
      <div key={index} className="mb-4 m-14">
 
        <ul>
          {Object.keys(update.updatedFields).map((field, idx) => (
            <li key={idx}>
              <strong className='text-blue-800'>{field}</strong> : 
              <span> Ancien - {update.updatedFields[field].old} </span> {/* Ancienne valeur */}
              <span> | Nouveau - {update.updatedFields[field].new}</span> {/* Nouvelle valeur */}
            </li>
          ))}
        </ul>
        <Typography className='text-right text-lg text-black ' variant="h6">
          Modifié le {new Date(update.modificationDate).toLocaleDateString()}
        </Typography>
      </div>
    ));
  };

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  // Fonction pour rendre le bon composant selon l'état
  const renderComponent = () => {
    if (etat === 0) return null;
    switch (activeComponent) {
    
      case 'ListeRDV':
        return <ListeEnergieAgent />;

      case 'AjoutContrat':
        return <SouscriptionEnergie />;
        case 'ChatEnergie':
          return <ChatEnergie currentUser={{ matricule: Matricule, name: userName }} />;
      default:
        return <SouscriptionEnergie />;
    }
  };

  return (
    
    <div className="flex">
      {/* Barre latérale */}

      <Card className="h-[calc(100vh-2rem)]  min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">
        {/* Logo */}
        <img
          className="object-cover w-auto h-24"
          src={logo}
          alt="Company Logo"
        />

        <div className="text-light-blue-900 pl-5 mb-4 pt-8 flex items-center space-x-2">
          <Typography variant="h6" className="flex items-center">
            {/*<Badge content={contratUpdates.length} overlap="circular">
              <button onClick={handleOpen}>*/}
                <img className="object-cover w-auto h-12" src={img} alt="User" />
              {/*</button>
            </Badge>*/}
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

        {/* Liste de menus */}
        <List>
          <ListItem
            onClick={() => setActiveComponent('ListeRDV')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5" />
            </ListItemPrefix>
            Liste des Souscriptions
          </ListItem>
          <ListItem
            onClick={() => setActiveComponent('AjoutContrat')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <IoCalendarNumber className="h-5 w-5" />
            </ListItemPrefix>
           Souscription 
          </ListItem>

          <ListItem
            onClick={() => setActiveComponent('ChatEnergie')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <IoCalendarNumber className="h-5 w-5" />
            </ListItemPrefix>
           Chat
          </ListItem>

          <ListItem
            onClick={handleLogout}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
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
              {/* Zone de contenu */}

      
      </div>

      {/* Boîte de dialogue pour les notifications */}
      <Dialog open={open} handler={handleOpen} className="max-h-[75vh]">
        <DialogHeader className='text-green-700'> <IoIosNotifications/>Notifications</DialogHeader>
        <DialogBody className="overflow-y-auto max-h-[50vh]">
          {contratUpdates.length > 0 ? (
            renderUpdatedFields() // Fonction qui affiche les champs modifiés
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

export default AgentEnergie;