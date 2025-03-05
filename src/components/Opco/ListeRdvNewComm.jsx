import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import { FaEye } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
function ListeRdvNewComm() {
  const [rdvs, setRdvs] = useState([]);
  const [filteredRdvs, setFilteredRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Nouvel état pour basculer entre affichage et modification
  const [formData, setFormData] = useState({}); // Stocke les données modifiées du formulaire

  useEffect(() => {
    const fetchRdvs = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/rdvs');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des rendez-vous');
        }
        const data = await response.json();
        setRdvs(data.rdvs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRdvs();
  }, []);

  useEffect(() => {
    if (rdvs && Array.isArray(rdvs)) {
      const results = rdvs.filter((rdv) =>
        `${rdv.nom} ${rdv.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRdvs(results);
    }
  }, [searchTerm, rdvs]);

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false); // Ferme le mode édition
  };

  const handleViewRdv = (RDV) => {
    setSelectedRdv(RDV);
    setFormData(RDV); // Pré-remplit le formulaire avec les données actuelles
    setShowModal(true);
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
      <div className="mb-4">
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
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Agent</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Type Rendez-vous</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Résultat du RDV</th>
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
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Formation demander</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date Prise RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Heure RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire Agent</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire Commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire Manager</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">état du dossier</th>



            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRdvs.slice().reverse().map((RDV, index) => (
              <tr key={RDV._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{filteredRdvs.length - index}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <FaEye 
                  className="text-blue-500 cursor-pointer w-4 h-4" 
                  onClick={() => handleViewRdv(RDV)} 
                  />
                  
                </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.userName}</td>
                <td
                   className={`px-4 py-3 text-sm ${
                   RDV.rdvType === 'Physique' ? 'text-green-500' : RDV.rdvType === 'Téléphonique' ? 'text-blue-700' : RDV.rdvType === 'Siège' ? 'text-orange-700' : 'text-gray-700'
                   }`}
                >
                 {RDV.rdvType}
                </td>
                <td
                   className={`px-4 py-3 text-sm ${
                   RDV.resultatRdv === 'Porte ouverte' ? 'text-green-500' : RDV.resultatRdv === 'Porte non-ouverte' ? 'text-red-700' : 'text-gray-700'
                   }`}
                >
                 {RDV.resultatRdv}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.entreprise}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.nom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.prenom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.telephone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.siret}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.nbrempl}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.adresse}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.codePostal}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.ville}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.formation}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.datePriseRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.dateRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.heureRDV}</td>
                <td className="px-4 py-3 text-sm text-blue-700">{RDV.commentaireAgent}</td>
                <td className="px-4 py-3 text-sm text-red-500">{RDV.commentaireCommercial}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.commentaireManager}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.etatDossier}</td>


              </tr>
            ))}
          </tbody>
          </div>
        </table>
      

      {/* Modal */}
      {showModal && selectedRdv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 overflow-y-auto max-h-screen">
            {!isEditing ? (
              <>
                <h2 className="text-2xl text-blue-500 font-semibold mb-4">Détails du Rendez-vous</h2>
                <p className="text-left"><strong>Agent :</strong> {selectedRdv.userName}</p>
                <p className="text-left"><strong>Type Rendez-vous :</strong>
              <span className={`${selectedRdv.rdvType === 'Physique' ? 'text-green-500' : selectedRdv.rdvType === 'Téléphonique' ? 'text-blue-700' :selectedRdv.rdvType === 'Siège' ? 'text-orange-700' : 'text-gray-700'}`}>
               {selectedRdv.rdvType}
              </span>
              </p>
              <p className="text-left"><strong>Nom du l'entreprise :</strong> {selectedRdv.entreprise}</p>
                <p className="text-left"><strong>Nom :</strong> {selectedRdv.nom}</p>
                <p className="text-left"><strong>Prénom :</strong> {selectedRdv.prenom}</p>
                <p className="text-left"><strong>Téléphone :</strong> {selectedRdv.telephone}</p>
                <p className="text-left"><strong>Email :</strong> {selectedRdv.email}</p>
                <p className="text-left"><strong>SIRET :</strong> {selectedRdv.siret}</p>
                <p className="text-left"><strong>nombre de salariés :</strong> {selectedRdv.nbrempl}</p>
                <p className="text-left"><strong>Adresse :</strong> {selectedRdv.adresse}</p>
                <p className="text-left"><strong>Code postal :</strong> {selectedRdv.codePostal}</p>
                <p className="text-left"><strong>Ville:</strong> {selectedRdv.ville}</p>
                <p className="text-left"><strong>Formation :</strong> {selectedRdv.formation}</p>
                <p className="text-left"><strong>Date prise RDV:</strong> {selectedRdv.datePriseRDV}</p>
                <p className="text-left"><strong>Date RDV :</strong> {selectedRdv.dateRDV}</p>
                <p className="text-left"><strong>Heure RDV :</strong> {selectedRdv.heureRDV}</p>
                <p className="text-left"><strong>état du dossier :</strong><span className="text-red-500"> {selectedRdv.etatDossier}</span></p>
                <p className="text-left"><strong>Commentaire Agent :</strong><span className="text-blue-700"> {selectedRdv.commentaireAgent}</span></p>

                <p className="text-left"><strong>Commentaire manager :</strong> {selectedRdv.commentaireManager}</p>
                <p className="text-left"><strong>Commentaire Commercial :</strong><span className="text-red-500"> {selectedRdv.commentaireCommercial}</span></p>
                <p className="text-left"><strong>Resultat du RDV:</strong> {selectedRdv.resultatRdv}</p>
                
                
              </>
            ) 
              : (
              <>
                
              </>
            )}
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeRdvNewComm;
