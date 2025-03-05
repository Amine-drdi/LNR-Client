import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash  } from 'react-icons/fa'; // Importer l'icône de vue
import Commercial from '../role/Commercial';

function ListeDevisGestio() {
  const [deviss, setDeviss] = useState([]);
  const [filteredDevis, setFilteredDeviss] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDevis, setSelectedDevis] = useState(null); // Contrat sélectionné pour le modal
  const [showModal, setShowModal] = useState(false); // Contrôle du modal
  const [isEditing, setIsEditing] = useState(false); // État pour savoir si on est en mode édition
  const [updatedDevis, setUpdatedDevis] = useState({}); // État pour stocker les modifications
  const navigate = useNavigate();

  const compagnies = ["Néoliane", "Assurema", "Alptis", "April", "Malakoff Humanis", "Cegema", "Swisslife", "Soly Azar", "Zenio"];

  useEffect(() => {
    const fetchdevis = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/devis');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des devis');
        }
        const data = await response.json();
        setDeviss(data.devis);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchdevis();

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
      const filtered = deviss.filter((devis) => {
        

        const signatureMonth = extractMonthFromDateString(devis.devisDate);
        const isMonthMatch = selectedMonth
          ? signatureMonth === parseInt(selectedMonth, 10)
          : true;

        const isSearchMatch =
          searchTerm === '' ||
          (devis.nom && devis.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (devis.prenom && devis.prenom.toLowerCase().includes(searchTerm.toLowerCase()));

        return isMonthMatch && isSearchMatch;
      });

      setFilteredDeviss(filtered);
    }
  }, [deviss, userName, selectedMonth, searchTerm]);

  const handleViewDevis = (devis) => {
    setSelectedDevis(devis); // Définir le contrat sélectionné
    setUpdatedDevis(devis); // Remplir le devis modifiable avec les données existantes
    setShowModal(true); // Afficher le modal
    setIsEditing(false); // Désactiver le mode édition par défaut
  };

  const closeModal = () => {
    setShowModal(false); // Fermer le modal
  };

  // Fonction pour sauvegarder les modifications et les envoyer à l'API
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `http://51.83.69.195:5000/api/devis/${selectedDevis._id}`,
        updatedDevis,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Mettre à jour la liste des devis avec les nouvelles données
        const updatedDeviss = deviss.map((devis) =>
          devis._id === selectedDevis._id ? { ...devis, ...updatedDevis } : devis
        );
        setDeviss(updatedDeviss);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du devis:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des devis...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4">Liste des Devis</h1>

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
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date du devis</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date d'Effet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Agent</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Compagnie</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Montant VP/mois</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Ancienne mutuelle</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Apporteur d'affaire</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire Agent</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevis.map((devis, index) => (
              <tr key={devis._id} className="border-b">
                <td className="px-4 py-4 text-center">{index + 1}</td>
                <td className="px-4 py-4 text-center">
                  <button onClick={() => handleViewDevis(devis)} className="text-light-blue-500 hover:text-light-blue-700">
                    <FaEye className="inline-block mr-2" />
                  </button>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.nom ? devis.nom.toUpperCase() : ''}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.prenom ? devis.prenom.toUpperCase() : ''}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.telephone}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.email}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.devisDate}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.effetDate}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.Commercial}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.compagnie}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.cotisation}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.ancienneMutuelle}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.apporteurAffaire}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{devis.commentaireAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal pour afficher les détails */}
      {showModal && selectedDevis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-screen">
            <h2 className="text-2xl font-semibold mb-4 text-light-blue-700">Détails du Devis</h2>
            
            {isEditing ? (
              <>
              <label className='font-semibold' >Nom</label>
                <input
                  type="text"
                  value={updatedDevis.nom || selectedDevis.nom}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, nom: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold' >Prénom</label>
                <input
                  type="text"
                  value={updatedDevis.prenom || selectedDevis.prenom}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, prenom: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label  className='font-semibold'>Téléphone</label>
                <input
                  type="text"
                  value={updatedDevis.telephone || selectedDevis.telephone}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, telephone: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Email</label>
                 <input
                  type="text"
                  value={updatedDevis.email || selectedDevis.email}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, email: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Date du devis</label>
                <input
                  type="text"
                  value={updatedDevis.devisDate || selectedDevis.devisDate}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, devisDate: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Date d'effet</label>
                <input
                  type="text"
                  value={updatedDevis.effetDate || selectedDevis.effetDate}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, effetDate: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Agent</label>
                 <input
                  type="text"
                  value={updatedDevis.Commercial || selectedDevis.Commercial}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, Commercial: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Compagnie</label>
                <input
                  type="text"
                  value={updatedDevis.compagnie || selectedDevis.compagnie}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, compagnie: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Montant VP/Mois</label>
                <input
                  type="text"
                  value={updatedDevis.cotisation || selectedDevis.cotisation}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, cotisation: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Ancienne mutuelle</label>
                 <input
                  type="text"
                  value={updatedDevis.ancienneMutuelle || selectedDevis.ancienneMutuelle}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, ancienneMutuelle: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Apporteur d'affaire</label>
                <input
                  type="text"
                  value={updatedDevis.apporteurAffaire|| selectedDevis.apporteurAffaire}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, apporteurAffaire: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                <label className='font-semibold'>Commetaire Agent</label>
                <input
                  type="text"
                  value={updatedDevis.commentaireAgent || selectedDevis.commentaireAgent}
                  onChange={(e) => setUpdatedDevis({ ...updatedDevis, commentaireAgent: e.target.value })}
                  className="border px-2 py-1 w-full rounded"
                />
                
              </>
            ) : (
              <>
                <p className='text-left'><strong>Nom:</strong> {selectedDevis.nom ? selectedDevis.nom.toUpperCase() : ''}</p>
                <p className='text-left'><strong>Prénom:</strong> {selectedDevis.prenom ? selectedDevis.prenom.toUpperCase() : ''}</p>
                <p className='text-left'><strong>Téléphone:</strong> {selectedDevis.telephone}</p>
                <p className='text-left'><strong>Email:</strong> {selectedDevis.email}</p>
                <p className='text-left'><strong>Date du devis:</strong> {selectedDevis.devisDate }</p>
                <p className='text-left'><strong>Date d'effet:</strong> {selectedDevis.effetDate }</p>
                <p className='text-left'><strong>Agent:</strong> {selectedDevis.Commercial}</p>
                <p className='text-left'><strong>Compagnie:</strong> {selectedDevis.compagnie}</p>
                <p className='text-left'><strong>Montant VP/mois:</strong> {selectedDevis.cotisation}</p>
                <p className='text-left'><strong>Ancienne mutuelle:</strong> {selectedDevis.ancienneMutuelle }</p>
                <p className='text-left'><strong>Apporteur d'affaire:</strong> {selectedDevis.apporteurAffaire}</p>
                <p className='text-left'><strong>Commentaire agent:</strong> {selectedDevis.commentaireAgent}</p>

                {/* Afficher les autres propriétés */}
              </>
            )}

            <div className="mt-4 flex space-x-4">
              {isEditing ? (
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Sauvegarder
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Modifier
                </button>
              )}

              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeDevisGestio;
