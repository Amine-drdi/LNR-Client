import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function Souscription({ setIsAdding }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [profession, setProfession] = useState('');
  const [signatureDate, setSignatureDate] = useState('');
  const [cotisation, setCotisation] = useState('');
  const [compagnie, setCompagnie] = useState('');
  const [effetDate, setEffetDate] = useState('');
  const [fraisEntre, setFraisEntre] = useState('');
  const [fraisDossier, setFraisDossier] = useState('');
  const [interetClient, setInteretClient] = useState('');
  const [apporteurAffaire, setApporteurAffaire] = useState('');
  const [ancienneMutuelle , setAncienneMutuelle] = useState('');
  const [typeResiliation , setTypeResiliation] = useState('');
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
  
    if (!nom || !prenom || !telephone || !email || !dob || !address || !profession || !cotisation || !compagnie || !effetDate || !apporteurAffaire || !fraisEntre || !fraisDossier || !interetClient || !ancienneMutuelle || !typeResiliation ) {
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
  
    // Générer la date d'aujourd'hui
    const today = new Date();
    const formattedSignatureDate = formatDate(today); // Formater la date d'aujourd'hui
  
    // Reformater la date d'effet
    const formattedEffetDate = formatDate(effetDate);
  
    // Utilisation de FormData pour envoyer le fichier et les données
    const newContract = {
      nom,
      prenom,
      telephone,
      email,
      dob,
      address,
      profession,
      signatureDate: formattedSignatureDate, // Utiliser la date d'aujourd'hui formatée
      cotisation,
      compagnie,
      effetDate: formattedEffetDate,
      fraisEntre,
      fraisDossier,
      interetClient,
      apporteurAffaire,
      Commercial,
      commentaireAgent,
      ancienneMutuelle,
      typeResiliation,
    };
  
    try {
      const response = await fetch('http://51.83.69.195:5000/api/contrats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ajout du header pour JSON
        },
        body: JSON.stringify(newContract),
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
        throw new Error("Erreur lors de l'ajout du contrat");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible d'ajouter le contrat.",
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-blue-gray-50 shadow-lg rounded-lg border border-blue-gray-200">
      <form onSubmit={handleAdd} className="space-y-6">
      
        {/* Section Identité du Souscripteur */}
        <h2 className="text-2xl font-bold text-blue-gray-800 mb-4">Identité du Souscripteur  </h2>

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
          <option value="Néoliane">Néoliane</option>
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
            <label htmlFor="fraisEntre" className="block text-sm font-medium text-blue-gray-700">Frais d'entrée</label>
            <input
              id="fraisEntre"
              type="text"
              value={fraisEntre}
              onChange={(e) => setFraisEntre(e.target.value)}
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
            <label htmlFor="interetClient" className="block text-sm font-medium text-blue-gray-700">Intérêt du Client</label>
            <input
              id="interetClient"
              type="text"
              value={interetClient}
              onChange={(e) => setInteretClient(e.target.value)}
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
            <label htmlFor="typeResiliation" className="block text-sm font-medium text-blue-gray-700">Type de Résiliation</label>
         <select
          id="typeResiliation"
          name="typeResiliation"
          value={typeResiliation}
          onChange={(e) => setTypeResiliation(e.target.value)}
          className="border border-blue-gray-300 rounded-md p-3 w-full focus:ring-blue-gray-500 focus:border-blue-gray-500"
        >
          <option value=""></option>
          <option value="Infra">Infra</option>
          <option value="Résiliation à échéance">Résiliation à échéance </option>

        </select>
    
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
          <option value="Sihem Selemi">Sihem Selemi</option>
          <option value="Hajer Askri">Hajer Askri</option>
          <option value="Rim Dabebi">Rim Dabebi </option>
          <option value="Yassmine Habibi">Yassmine Habibi</option>
          <option value="Wassila Taamli">Wassila Taamli</option>
          <option value="Houda">Houda</option>
          <option value="Zaineb Ben Younes">Zaineb Ben Younes</option>
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
          Ajouter le contrat
        </button>
      
      </form>
    </div>
  );
}

export default Souscription;