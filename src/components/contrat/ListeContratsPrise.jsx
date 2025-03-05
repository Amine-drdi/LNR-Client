import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa'; // Importer l'icône de vue

function ListeContratsPrise() {
  const [contrats, setContrats] = useState([]);
  const [filteredContrats, setFilteredContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedContrat, setSelectedContrat] = useState(null); // Contrat sélectionné pour le modal
  const [showModal, setShowModal] = useState(false); // Contrôle du modal
  const navigate = useNavigate();

  const compagnies = ["Néoliane", "Assurema", "Alptis", "April", "Malakoff Humanis", "Cegema", "Swisslife", "Soly Azar", "Zenio"];

  useEffect(() => {
    const fetchContrats = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/contrats');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contrats');
        }
        const data = await response.json();
        setContrats(data.contrats);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContrats();

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
          setUserRole(response.data.user.UserRole);

        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };

    fetchProfile();
  }, []);

  // Fonction pour extraire le mois d'une date sous forme de chaîne
  const extractMonthFromDateString = (dateString) => {
    if (!dateString) return null;

    const formats = [
      { regex: /(\d{4})-(\d{2})-(\d{2})/, groupIndex: 2 }, // yyyy-mm-dd
      { regex: /(\d{4})\/(\d{2})\/(\d{2})/, groupIndex: 2 }, // yyyy/mm/dd
      { regex: /(\d{2})-(\d{2})-(\d{4})/, groupIndex: 2 }, // dd-mm-yyyy (mois au milieu)
      { regex: /(\d{2})\/(\d{2})\/(\d{4})/, groupIndex: 2 }  // dd/mm/yyyy (mois au milieu)
    ];

    for (const format of formats) {
      const match = dateString.match(format.regex);
      if (match) {
        const month = parseInt(match[format.groupIndex], 10);
        if (month >= 1 && month <= 12) {
          return month; // Renvoie le mois sous forme de nombre
        }
      }
    }

    return null; // Aucun mois trouvé
  };

  useEffect(() => {
    if (userName) {
      let filtered = contrats;
  
      // Appliquer le filtre par userName uniquement si le userRole est 'Prise'
      if (userRole === 'Prise') {
        filtered = contrats.filter((contrat) => {
          const isapporteurAffaireMatch =
            contrat.apporteurAffaire &&
            contrat.apporteurAffaire.toLowerCase() === userName.toLowerCase();
  
          const signatureMonth = extractMonthFromDateString(contrat.signatureDate);
          const isMonthMatch = selectedMonth
            ? signatureMonth === parseInt(selectedMonth, 10)
            : true;
  
          const isSearchMatch =
            searchTerm === '' ||
            (contrat.nom && contrat.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (contrat.prenom && contrat.prenom.toLowerCase().includes(searchTerm.toLowerCase()));
  
          const isSignatureDateValid = contrat.signatureDate && contrat.signatureDate.trim() !== ''; // Vérification de la date de signature
  
          return isapporteurAffaireMatch && isMonthMatch && isSearchMatch && isSignatureDateValid;
        });
      } else {
        // Si le userRole est 'Direction' ou 'Gestionnaire', afficher tous les contrats
        filtered = contrats.filter((contrat) => {
          const signatureMonth = extractMonthFromDateString(contrat.signatureDate);
          const isMonthMatch = selectedMonth
            ? signatureMonth === parseInt(selectedMonth, 10)
            : true;
  
          const isSearchMatch =
            searchTerm === '' ||
            (contrat.nom && contrat.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (contrat.prenom && contrat.prenom.toLowerCase().includes(searchTerm.toLowerCase()))||
            (contrat.apporteurAffaire && contrat.apporteurAffaire.toLowerCase().includes(searchTerm.toLowerCase()));
  
          const isSignatureDateValid = contrat.signatureDate && contrat.signatureDate.trim() !== ''; // Vérification de la date de signature
  
          return isMonthMatch && isSearchMatch && isSignatureDateValid;
        });
      }
  
      setFilteredContrats(filtered);
    }
  }, [contrats, userName, selectedMonth, searchTerm, userRole]); // Ajout de userRole dans les dépendances
  

  const handleViewContrat = (contrat) => {
    setSelectedContrat(contrat); // Définir le contrat sélectionné
    setShowModal(true); // Afficher le modal
  };

  const closeModal = () => {
    setShowModal(false); // Fermer le modal
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des contrats...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4">Liste des Contrats</h1>

      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        />
      </div>

      <div className="mb-4 flex space-x-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        >
          <option value="">Tous les mois</option>
          <option value="1">Janvier</option>
          <option value="2">Février</option>
          <option value="3">Mars</option>
          <option value="4">Avril</option>
          <option value="5">Mai</option>
          <option value="6">Juin</option>
          <option value="7">Juillet</option>
          <option value="8">Août</option>
          <option value="9">Septembre</option>
          <option value="10">Octobre</option>
          <option value="11">Novembre</option>
          <option value="12">Décembre</option>
        </select>
      </div>

      <div className="overflow-x-scroll">
        <table className="min-w-[1200px] w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
          <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">#</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Vue</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">État du dossier</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Apporteur d'affaire</th>

              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date de Signature</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date d'Effet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Compagnie</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Montant VP/mois</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date d'Effet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Ancienne mutuelle</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Type de Résiliation</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          {filteredContrats.slice().reverse().map((contrat, index) => (
              <tr key={contrat._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{index + 1}</td>
                <td className="px-4 py-3 text-center">
                  <FaEye className="text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => handleViewContrat(contrat)} />
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.etatDossier}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.apporteurAffaire}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.signatureDate}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.nom ? contrat.nom.toUpperCase() : ''}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.prenom ? contrat.prenom.toUpperCase() : '' }</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.Commercial}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.compagnie}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.montantVP}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.effetDate}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.ancienneMutuelle}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.typeResiliation}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{contrat.commentaire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal pour afficher les détails d'un contrat */}
      {showModal && selectedContrat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">Détails du contrat</h2>
            <p><strong>Nom:</strong> {selectedContrat.nom ? selectedContrat.nom.toUpperCase() : ''}</p>
            <p><strong>Prénom:</strong> {selectedContrat.prenom ? selectedContrat.prenom.toUpperCase() : ''}</p>
            <p><strong>Date de Signature:</strong> {selectedContrat.signatureDate}</p>
            <p><strong>Date d'Effet:</strong> {selectedContrat.effetDate}</p>
            <p><strong>Commercial:</strong> {selectedContrat.Commercial}</p>
            <p><strong>Compagnie:</strong> {selectedContrat.compagnie}</p>
            <p><strong>Montant VP/mois:</strong> {selectedContrat.montantVP}</p>
            <p><strong>Ancienne mutuelle:</strong> {selectedContrat.ancienneMutuelle}</p>
            <p><strong>Apporteur d'affaire:</strong> {selectedContrat.apporteurAffaire}</p>
            <p><strong>Type de Résiliation:</strong> {selectedContrat.typeResiliation}</p>
            <p><strong>Commentaire:</strong> {selectedContrat.commentaire}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-gray-500 text-white rounded-lg hover:bg-blue-gray-700 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeContratsPrise;