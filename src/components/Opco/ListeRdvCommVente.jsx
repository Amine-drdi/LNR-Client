import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoIosRefresh } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function ListeRdvCommVente() {
  const navigate = useNavigate();
  const [role, setRole] = useState([]);
  const [rdvs, setRdvs] = useState([]);
  const [filteredRdvs, setFilteredRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentaireCommercial, setCommentaireCommercial] = useState('');
  const [resultatRdv, setResultatRdv] = useState('');

  const closeModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://51.83.69.195:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRole(response.data.user.role);
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
  

  const fetchRdvs = async () => {
    setLoading(true); // Show loading before fetching
    try {
      const response = await fetch('http://51.83.69.195:5000/api/rdvsCommercial');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des rendez-vous');
      }
      const data = await response.json();
      setRdvs(data.rdvs);
      setFilteredRdvs(data.rdvs); // Initialiser filteredRdvs avec tous les RDVs
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRdvs(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    if (rdvs && Array.isArray(rdvs)) {
      // Filtrer uniquement par le terme de recherche
      const results = rdvs.filter((rdv) =>
        `${rdv.nom} ${rdv.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRdvs(results);
    }
  }, [searchTerm, rdvs]);

  useEffect(() => {
    if (role === 'CommercialeVente(B)') {
      setFilteredRdvs(rdvs.filter(rdv => rdv.role === 'CommercialeOPCO(B)'));
    } else if (role === 'CommercialeVente(A)') {
      setFilteredRdvs(rdvs.filter(rdv => rdv.role !== 'CommercialeOPCO(B)'));
    } 
    
    else {
      setFilteredRdvs(rdvs); // Aucun filtre si le rôle ne correspond pas
    }
  }, [rdvs, role]);
  
  const handleViewRdv = (RDV) => {
    setSelectedRdv(RDV);
    setCommentaireCommercial(RDV.commentaireCommercial || '');
    setResultatRdv(RDV.resultatRdv || ''); // Charger le résultat existant
    setShowModal(true);
  };

  const handleSaveComment = async () => {
    if (selectedRdv) {
      try {
        const response = await fetch(`http://51.83.69.195:5000/api/rdvs/${selectedRdv._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commentaireCommercial,resultatRdv }),
          
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du commentaire');
        }

        const updatedRdv = { ...selectedRdv, commentaireCommercial, resultatRdv };
        setRdvs((prevRdvs) =>
          prevRdvs.map((rdv) =>
            rdv._id === selectedRdv._id ? updatedRdv : rdv
          )
        );
        closeModal();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleRefresh = () => {
    fetchRdvs(); // Fetch the RDVs again when the button is clicked
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des rendez-vous...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
         <h1 className="text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4">Liste des Rendez-vous</h1>
      
      {/* Refresh Button */}
      <button 
        onClick={handleRefresh} 
        className="mb-4 px-4 py-2 bg-transparent text-blue-gray-700 rounded  flex items-center"
      >
        <IoIosRefresh className="mr-2" /> Actualiser
      </button>
      
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        />
      </div>

       <table className="min-w-[1200px] w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">          
       <div className="overflow-x-scroll">

        <thead className="bg-blue-gray-500 border-b w-full">
        
            <tr>              
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">#</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Type RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Entreprise</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">SIRET</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nombre de salariés</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Adresse</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Code Postal</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Ville</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Formation</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date Prise RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Heure RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Résultat du rendez-vous </th>
            </tr>
            
          </thead>
          <tbody className="divide-y divide-gray-200">
          {filteredRdvs.slice().reverse().map((RDV, index) => (
              <tr key={RDV._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 text-center">{filteredRdvs.length - index}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <FaRegCommentDots
                    className="text-blue-500 cursor-pointer w-4 h-4"
                    onClick={() => handleViewRdv(RDV)}
                  />
                </td>
                <td
                   className={`px-4 py-3 text-sm ${
                   RDV.rdvType === 'Physique' ? 'text-green-500' : RDV.rdvType === 'Téléphonique' ? 'text-blue-700' : 'text-gray-700'
                   }`}
                >
                 {RDV.rdvType}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.entreprise}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.nom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.prenom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.telephone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.siret}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.adresse}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.nbrempl}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.codePostal}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.ville}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.formation}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.datePriseRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.dateRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.heureRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.commentaireCommercial}</td>
                <td
                   className={`px-4 py-3 text-sm ${
                   RDV.resultatRdv === 'Porte ouverte' ? 'text-green-500' : RDV.resultatRdv === 'Porte non-ouverte' ? 'text-red-700' : 'text-gray-700'
                   }`}
                >
                 {RDV.resultatRdv}
                </td>
              </tr>
            ))}
            
          </tbody>
          </div>
        </table>
       
      
      

        {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Détails du Rendez-vous</h2>
            
            {/* Commentaire */}
            <div className="mb-4">
              <label htmlFor="commentaire" className="block text-sm font-medium text-gray-700">Commentaire Commercial</label>
              <textarea
                id="commentaire"
                value={commentaireCommercial}
                onChange={(e) => setCommentaireCommercial(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
              />
            </div>
            
            {/* Résultat RDV */}
            <div className="mb-4">
              <label htmlFor="resultatRdv" className="block text-sm font-medium text-gray-700">Résultat du RDV</label>
              <select
                id="resultatRdv"
                value={resultatRdv}
                onChange={(e) => setResultatRdv(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
              >
                <option value=""></option>
                <option value="Porte ouverte">Porte ouverte</option>
                <option value="Porte non-ouverte">Porte non-ouverte</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded text-gray-700"
              >
                Fermer
              </button>
              <button
                onClick={handleSaveComment}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeRdvCommVente;