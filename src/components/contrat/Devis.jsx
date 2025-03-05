import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; // Assure-toi d'avoir installé axios
import { useNavigate } from 'react-router-dom';

function Devis({ setIsAdding }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [profession, setProfession] = useState('');
  const [devisDate, setDevisDate] = useState('');
  const [cotisation, setCotisation] = useState('');
  const [compagnie, setCompagnie] = useState('');
  const [effetDate, setEffetDate] = useState('');
  const [formulePropose, setFormulePropose] = useState('');
  const [fraisDossier, setFraisDossier] = useState('');
  const [niveauPropose, setNiveauProose] = useState('');
  const [apporteurAffaire, setApporteurAffaire] = useState('');
  const [ancienneMutuelle , setAncienneMutuelle] = useState('');
 
  const [commentaireAgent, setCommentaireAgent] = useState('');
  const [Commercial, setUserName] = useState('');

  const textInput = useRef(null);
  const navigate = useNavigate(); // Utilisation du hook navigate pour rediriger

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

    if (!nom || !prenom || !telephone || !email || !dob || !address || !profession || !devisDate || !cotisation || !compagnie || !effetDate || !apporteurAffaire || !formulePropose|| !fraisDossier || !niveauPropose || !ancienneMutuelle  ) {
      return Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Tous les champs sont obligatoires.',
        showConfirmButton: true,
        timer: 1500,
      });
    }

      // Fonction pour reformater une date en jj/mm/aaaa
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0 en JavaScript
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Reformater les dates
  const formattedDevisDate = formatDate(devisDate);
  const formattedEffetDate = formatDate(effetDate);

    // Utilisation de FormData pour envoyer le fichier et les données
    const newDevis = {
      nom,
      prenom,
      telephone,
      email,
      dob,
      address,
      profession,
      devisDate: formattedDevisDate,
      heure: String,
      cotisation,
      compagnie,
      effetDate: formattedEffetDate,
      formulePropose,
      fraisDossier,
      niveauPropose,
      apporteurAffaire,
      Commercial,
      commentaireAgent,
      ancienneMutuelle,
    };
    try {
      const response = await fetch('http://51.83.69.195:5000/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ajout du header pour JSON
        },
        body: JSON.stringify(newDevis),
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Ajouté',
          text: `Les données de ${nom} ${prenom} ont été ajoutées.`,
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        throw new Error("Erreur lors de l'ajout du devis");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible d'ajouter le devis.",
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-blue-gray-50 shadow-lg rounded-lg border border-blue-gray-200">
      <form onSubmit={handleAdd} className="space-y-6">
      
        {/* Section Identité du Souscripteur */}
        <h2 className="text-2xl font-bold text-blue-gray-800 mb-4">Devis  </h2>
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
            <label htmlFor="phone" className="block text-sm font-medium text-blue-gray-700">Téléphone</label>
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-blue-gray-700">Date de Naissance</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-blue-gray-700">Adresse</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-blue-gray-700">Profession</label>
            <input
              id="profession"
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
        </div>

        {/* Section Contrat */}
        <h2 className="text-2xl font-bold text-blue-gray-800 mb-4">Contrat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="signatureDate" className="block text-sm font-medium text-blue-gray-700">Date du devis</label>
            <input
              id="devisDate"
              type="date"
              value={devisDate}
              onChange={(e) => setDevisDate(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="cotisation" className="block text-sm font-medium text-blue-gray-700">Montant VP/mois</label>
            <input
              id="cotisation"
              type="number"
              value={cotisation}
              onChange={(e) => setCotisation(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="compagnie" className="block text-sm font-medium text-blue-gray-700">Compagnie</label>
            <select
          id="compagnie"
          name="compagnie"
          value={compagnie}
          onChange={(e) => setCompagnie(e.target.value)}
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
          <div>
            <label htmlFor="effetDate" className="block text-sm font-medium text-blue-gray-700">Date d'effet</label>
            <input
              id="effetDate"
              type="date"
              value={effetDate}
              onChange={(e) => setEffetDate(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="formulepropose" className="block text-sm font-medium text-blue-gray-700">Formule proposé</label>
            <input
              id="formulepropose"
              type="text"
              value={formulePropose}
              onChange={(e) => setFormulePropose(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="fraisDossier" className="block text-sm font-medium text-blue-gray-700">Frais de dossier</label>
            <input
              id="fraisDossier"
              type="text"
              value={fraisDossier}
              onChange={(e) => setFraisDossier(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="niveauPropose" className="block text-sm font-medium text-blue-gray-700">Niveau proposé</label>
            <input
              id="niveauPropose"
              type="text"
              value={niveauPropose}
              onChange={(e) => setNiveauProose(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
          <div>
            <label htmlFor="ancienneMutuelle" className="block text-sm font-medium text-blue-gray-700">Ancienne Mutuelle</label>
            <input
              id="ancienneMutuelle"
              type="text"
              value={ancienneMutuelle}
              onChange={(e) => setAncienneMutuelle(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
            />
          </div>
         
          <div>
            <label htmlFor="apporteurAffaire" className="block text-sm font-medium text-blue-gray-700">Apporteur d'affaire</label>
         <select
          id="apporteurAffaire"
          name="apporteurAffaire"
          value={apporteurAffaire}
          onChange={(e) => setApporteurAffaire(e.target.value)}
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

        <div className="col-span-2">
            <label htmlFor="commentaireAgent" className="block text-sm font-medium text-blue-gray-700">Commentaire</label>
            <textarea
              id="commentaireAgent"
              value={commentaireAgent}
              onChange={(e) => setCommentaireAgent(e.target.value)}
              className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
              rows="4"
            ></textarea>
          </div>



        </div>

        <button type="submit" className="bg-blue-gray-600 text-white py-2 px-6 rounded-lg hover:bg-blue-gray-700 transition duration-150">
          Ajouter le devis
        </button>
      
      </form>
    </div>
  );
}

export default Devis;