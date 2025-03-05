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
import ListeRdvNewComm from './ListeRdvNewComm';

function NewCommVente() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [contratUpdates, setContratUpdates] = useState([]);
  const [open, setOpen] = useState(false);
  const [etat, setEtat] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    // Fetch profile info
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
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };

    // Fetch contract updates
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const renderComponent = () => {
    if (etat === 0) return null;
    switch (activeComponent) {
      case 'listeContrats':
        return <ListeRdvNewComm />;
      default:
        return <ListeRdvNewComm />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Card className="md:h-[calc(100vh-2rem)] h-auto md:min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white w-full md:w-auto md:flex-shrink-0">
        <img
          className="object-cover w-auto h-24 mx-auto md:mx-0"
          src={logo}
          alt="Company Logo"
        />

        <div className="text-light-blue-900 pl-5 mb-4 pt-8 flex items-center space-x-2">
          <Typography variant="h6" className="flex items-center">
            <img className="object-cover w-auto h-12" src={img} alt="User" />
            {userName}
          </Typography>
        </div>

        {/* Menu List */}
        <List>
          <ListItem
            onClick={() => setActiveComponent('listeContrats')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5" />
            </ListItemPrefix>
            la liste des rendez-vous
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

      {/* Content Area */}
      <div className="flex-1 p-6 w-full">
        {renderComponent()}
      </div>
    </div>
  );
}

export default NewCommVente;