import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { IoCalendarNumber } from "react-icons/io5";
import { PowerIcon } from "@heroicons/react/24/solid";
import logo from "../../assets/logo.png";
import img from "../../assets/manager.png";
import { CiBoxList } from "react-icons/ci";
import SouscriptionEnergie from './SouscriptionEnergie';
import ListeEnergieManager from './ListeEnergieManager';
import ChatEnergie from '../ChatEnergie';
import { Button } from "@material-tailwind/react";

function ManagerEnergie() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [etat, setEtat] = useState('');
  const [Matricule, setMatricule] = useState('');
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
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
       // Actualisation toutes les 20 secondes
       const intervalId = setInterval(() => {
        fetchProfile(); // Rafraîchir les informations du profil
      }, 20000); // 20000 ms = 20 secondes
  
      // Nettoyer l'intervalle lors du démontage du composant
      return () => clearInterval(intervalId);
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

  // Function to render the correct component based on state
  const renderComponent = () => {
    if (etat === 0) return null;
    switch (activeComponent) {
      case 'ListeRDV':
        return <ListeEnergieManager />;
      case 'AjoutRDV':
        return <SouscriptionEnergie />;
        case 'ChatEnergie':
          return <ChatEnergie currentUser={{ matricule: Matricule, name: userName }} />;
      default:
        return <SouscriptionEnergie />;
    }
  };

  return (
    <div className="flex ">
      {/* Sidebar */}
      <Card className="h-[calc(100vh-2rem)]  min-w-[20rem] p-4 shadow-xl bg-blue-gray-500 text-white">        {/* Logo */}
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
            onClick={() => setActiveComponent('ListeRDV')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5" />
            </ListItemPrefix>
            Liste des Souscriptions
          </ListItem>

          <ListItem
            onClick={() => setActiveComponent('AjoutRDV')}
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

export default ManagerEnergie;
