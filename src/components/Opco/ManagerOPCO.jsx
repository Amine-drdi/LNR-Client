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
import SouscriptionOPCO from './SouscriptionOPCO';
import ListeRdv from './ListeRdv';
import ListeRdvManager from './ListeRdvManager';
function ManagerOPCO() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [etat, setEtat] = useState('');
  const navigate = useNavigate();

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
      case 'listeRdv':
        return <ListeRdvManager />;
      case 'AjoutRDV':
        return <SouscriptionOPCO />;
      default:
        return <ListeRdvManager />;
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

        {/* Menu List */}
        <List>
          <ListItem
            onClick={() => setActiveComponent('listeRdv')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <CiBoxList className="h-5 w-5" />
            </ListItemPrefix>
           liste des Rendez-vous
          </ListItem>

          <ListItem
            onClick={() => setActiveComponent('AjoutRDV')}
            className={`hover:bg-blue-600 text-white ${etat === 0 ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ListItemPrefix>
              <IoCalendarNumber className="h-5 w-5" />
            </ListItemPrefix>
            Ajouter UN RDV
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

export default ManagerOPCO;
