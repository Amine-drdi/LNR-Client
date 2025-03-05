import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Radio, Checkbox, List, ListItem, ListItemPrefix, Typography, Card } from '@material-tailwind/react';

function SouscriptionEnergie({ setIsAdding }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [datePriseRDV, setDatePriseRDV] = useState('');
  const [dateRDV, setDateRDV] = useState('');
  const [heureRDV, setHeureRDV] = useState('');
  const [userName, setUserName] = useState('');
  const [role, setUserRole] = useState('');
  const [rdvType, setRdvType] = useState('');
  const [commentaireAgent, setCommentaireAgent] = useState('');
  const textInput = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }

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

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !email || !telephone  || !adresse || !codePostal || !ville  || !datePriseRDV || !dateRDV || !heureRDV || !rdvType) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Tous les champs sont obligatoires.',
        showConfirmButton: true,
        timer: 1500,
      });
    }

    const newEnergie = {
      nom,
      prenom,
      email,
      telephone,
      adresse,
      codePostal,
      ville,
      datePriseRDV,
      dateRDV,
      heureRDV,
      userName,
      role,
      rdvType,
      commentaireAgent
    };

    try {
      const response = await fetch('http://51.83.69.195:5000/api/energies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEnergie),
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Ajouté',
          text: `Le rendez-vous de ${nom} ${prenom} a été ajouté.`,
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        throw new Error("Erreur lors de l'ajout du rendez-vous");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible d'ajouter le rendez-vous.",
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };

 

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-blue-gray-50 shadow-lg rounded-lg border border-blue-gray-200">
      <form onSubmit={handleAdd} className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-gray-800 mb-4">Formulaire de Souscription</h2>
        {/* Card with Radio buttons */}
        <div className="flex justify-center">
            <Card className="w-full max-w-[25rem] border border-blue-gray-300 rounded-md p-3 focus:ring-blue-gray-500 focus:border-blue-gray-500">
              <List className="flex-row">
                <ListItem className="p-0">
                  <label
                    htmlFor="horizontal-list-physique"
                    className="flex w-full  cursor-pointer items-center px-2 py-2"
                  >
                    <ListItemPrefix className="mr-3">
                      <Radio
                        name="rdvType"
                        id="horizontal-list-physique"
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                        checked={rdvType === 'Physique'}
                        onChange={() => setRdvType('Physique')}
                      />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="font-medium text-blue-gray-700"
                    >
                      RDV Physique 
                    </Typography>
                  </label>
                </ListItem>
                <ListItem className="p-0">
                  <label
                    htmlFor="horizontal-list-telephone"
                    className="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <ListItemPrefix className="mr-3">
                      <Radio
                        name="rdvType"
                        id="horizontal-list-telephone"
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                        checked={rdvType === 'Téléphonique'}
                        onChange={() => setRdvType('Téléphonique')}
                      />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="font-medium text-blue-gray-700"
                    >
                      RDV Téléphonique
                    </Typography>
                  </label>
                </ListItem>
                <ListItem className="p-0">
                  <label
                    htmlFor="horizontal-list-Siège"
                    className="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <ListItemPrefix className="mr-3">
                      <Radio
                        name="rdvType"
                        id="horizontal-list-Siège"
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                        checked={rdvType === 'Siège'}
                        onChange={() => setRdvType('Siège')}
                      />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="font-medium text-blue-gray-700"
                    >
                      RDV Siège
                    </Typography>
                  </label>
                </ListItem>
              </List>
            </Card>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-blue-gray-700">Nom</label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-blue-gray-700">Prénom</label>
            <input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-blue-gray-700">Téléphone</label>
            <input
              id="telephone"
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-gray-700">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-blue-gray-700">Adresse</label>
            <input
              id="adresse"
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="codePostal" className="block text-sm font-medium text-blue-gray-700">Code postal</label>
            <input
              id="codePostal"
              type="text"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-blue-gray-700">Ville</label>
            <input
              id="ville"
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="datePriseRDV" className="block text-sm font-medium text-blue-gray-700">Date de prise de rendez-vous</label>
            <input
              id="datePriseRDV"
              type="date"
              value={datePriseRDV}
              onChange={(e) => setDatePriseRDV(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="dateRDV" className="block text-sm font-medium text-blue-gray-700">Date du rendez-vous</label>
            <input
              id="dateRDV"
              type="date"
              value={dateRDV}
              onChange={(e) => setDateRDV(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="heureRDV" className="block text-sm font-medium text-blue-gray-700">Heure du rendez-vous</label>
            <input
              id="heureRDV"
              type="time"
              value={heureRDV}
              onChange={(e) => setHeureRDV(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
        </div>

          <div className="mt-6">
          <label htmlFor="commentaire" className="block text-sm font-medium text-blue-gray-700">Commentaire</label>
          <textarea id="commentaireAgent" value={commentaireAgent} onChange={(e) => setCommentaireAgent(e.target.value)} className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500" rows="4"></textarea>
        </div>
        <button type="submit" className="bg-blue-gray-600 text-white py-2 px-6 rounded-lg hover:bg-blue-gray-700 transition duration-150">
          Valider
        </button>
      </form>
    </div>
  );
}

export default SouscriptionEnergie;
