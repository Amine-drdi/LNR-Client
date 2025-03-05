import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
function ListeRdvManager() {
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
        `${rdv.nom} ${rdv.prenom} ${rdv.userName}`.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEditClick = () => {
    setIsEditing(true); // Active le mode édition
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/rdvs/${selectedRdv._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des données');
      }

      // Met à jour la liste des rendez-vous avec les données modifiées
      setRdvs((prevRdvs) =>
        prevRdvs.map((rdv) => (rdv._id === selectedRdv._id ? formData : rdv))
      );

      closeModal(); // Ferme le modal après la modification
    } catch (error) {
      setError(error.message);
    }
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

      <div className="overflow-x-scroll">
        <table className="min-w-[1200px] w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
          <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">#</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Agent</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Type rendez-vous</th>
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
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire manager</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">état du dossier</th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          {filteredRdvs.slice().reverse().map((RDV, index) => (
              <tr key={RDV._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 text-center">{filteredRdvs.length - index}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <FaEye className="text-blue-500 cursor-pointer w-4 h-4" onClick={() => handleViewRdv(RDV)} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{RDV.userName}</td>
               
                <td
                   className={`px-4 py-3 text-sm ${
                   RDV.rdvType === 'Physique' ? 'text-green-500' : RDV.rdvType === 'Téléphonique' ? 'text-blue-700' : RDV.rdvType === 'Siège' ? 'text-orange-700' :  RDV.rdvType === 'Transverse' ? 'text-pink-400' : 'text-gray-700'
                   }`}
                >
                 {RDV.rdvType}
                </td>
                <td
                className={`px-4 py-3 text-sm flex items-center gap-2 ${
                RDV.resultatRdv === 'Porte ouverte'
                 ? 'text-green-500'
                : RDV.resultatRdv === 'Porte non-ouverte'
                ? 'text-red-700'
                : 'text-gray-700'
                }`}
                 >
                {/* Affichage de l'icône en fonction de resultatRdv */}
                {RDV.resultatRdv === 'Porte ouverte' && <FaDoorOpen />}
                {RDV.resultatRdv === 'Porte non-ouverte' && <FaDoorClosed />}
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
        </table>
      </div>

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
              <p className="text-left"><strong>Résultat du RDV :</strong> 
              <span className={`${selectedRdv.resultatRdv === 'Porte ouverte' ? 'text-green-500' : selectedRdv.resultatRdv === 'Porte non-ouverte' ? 'text-blue-700' : 'text-gray-700'}`}>
               {selectedRdv.resultatRdv}
              </span>
              </p>
              <p className="text-left"><strong>Nom du l'entreprise :</strong> {selectedRdv.entreprise}</p>
                <p className="text-left"><strong>Nom :</strong> {selectedRdv.nom}</p>
                <p className="text-left"><strong>Prénom :</strong> {selectedRdv.prenom}</p>
                <p className="text-left"><strong>Téléphone :</strong> {selectedRdv.telephone}</p>
                <p className="text-left"><strong>Email :</strong> {selectedRdv.email}</p>
                <p className="text-left"><strong>SIRET :</strong> {selectedRdv.siret}</p>
                <p className="text-left"><strong>Nombre de salariés :</strong> {selectedRdv.nbrempl}</p>
                <p className="text-left"><strong>Adresse :</strong> {selectedRdv.adresse}</p>
                <p className="text-left"><strong>Code postal :</strong> {selectedRdv.codePostal}</p>
                <p className="text-left"><strong>Ville:</strong> {selectedRdv.ville}</p>
                <p className="text-left"><strong>Formation :</strong> {selectedRdv.formation}</p>
                <p className="text-left"><strong>Date prise RDV:</strong> {selectedRdv.datePriseRDV}</p>
                <p className="text-left"><strong>Date RDV :</strong> {selectedRdv.dateRDV}</p>
                <p className="text-left"><strong>Heure RDV :</strong> {selectedRdv.heureRDV}</p>
                <p className="text-left"><strong>état du dossier :</strong> {selectedRdv.etatDossier}</p>
                <p className="text-left"><strong>Commentaire Agent :</strong> {selectedRdv.commentaireAgent}</p>
                <p className="text-left"><strong>Commentaire Commercial :</strong><span className="text-red-500"> {selectedRdv.commentaireCommercial}</span></p>
                <p className="text-left"><strong>Commentaire Manager :</strong> {selectedRdv.commentaireManager}</p>


                
                <button
                  onClick={handleEditClick}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl text-blue-500 font-semibold mb-4">Modifier le Rendez-vous</h2>
                <form>

                <label className="block mb-2">
                    <span className="text-gray-700">Agent :</span>
                    <input
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                  <span className="text-gray-700">Type rendez-vous :</span>
                  <select
                    name="rdvType"
                    value={formData.rdvType}
                    onChange={handleInputChange}
                    className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm ${
                    formData.rdvType === 'Physique' ? 'text-green-500' : formData.rdvType === 'Téléphonique' ? 'text-blue-700' : formData.rdvType === 'Siège' ? 'text-orange-700' : 'text-gray-700'
                    }`}
                  >
                     <option value="" >Choisissez un type de rendez-vous</option>
                     <option value="Physique" className="text-green-500">Physique</option>
                     <option value="Téléphonique" className="text-blue-700">Téléphonique</option>
                     <option value="Siège" className="text-orange-700">Siège</option>
                  </select>
                  </label>

                  <label className="block mb-2">
                    <span className="text-gray-700">Nom :</span>
                    <input
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Prénom:</span>
                    <input
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Téléphone :</span>
                    <input
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Email :</span>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>

                  <label className="block mb-2">
                    <span className="text-gray-700">Nom du l'entreprise :</span>
                    <input
                      name="entreprise"
                      value={formData.entreprise}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">SIRET :</span>
                    <input
                      name="siret"
                      value={formData.siret}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Nombre de salariés :</span>
                    <input
                      name="nbrempl"
                      value={formData.nbrempl}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Adresse :</span>
                    <input
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Code postal:</span>
                    <input
                      name="codePostal"
                      value={formData.codePostal}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Ville :</span>
                    <input
                      name="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Formation demander :</span>
                    <input
                      name="formation"
                      value={formData.formation}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Date prise RDV :</span>
                    <input
                      name="datePriseRDV"
                      value={formData.datePriseRDV}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Date RDV :</span>
                    <input
                      name="dateRDV"
                      value={formData.dateRDV}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Heure RDV :</span>
                    <input
                      name="heureRDV"
                      value={formData.heureRDV}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                
                  <label className="block mb-2">
                    <span className="text-gray-700">état du dossier:</span>
                    <select
                     name="etatDossier"
                     value={formData.etatDossier}
                     onChange={handleInputChange}
                     className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">choisissez une option </option>
                       <option className='text-green-700' value="Validé">Validé</option>
                       <option className='text-red-700' value="non Validé">non Validé</option>
                       <option value="R2">R2</option>
                       <option value="R3">R3</option>
                       <option value="Pas intéressé">Pas intéressé</option>
                       <option value="Déjà engagé">Déjà engagé</option>
                    </select>

                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Commentaire Agent:</span>
                    <input
                      name="commentaireAgent"
                      value={formData.commentaireAgent}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Commentaire Manager :</span>
                    <input
                      name="commentaireManager"
                      value={formData.commentaireManager}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  
                  
                  <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    type="button"
                  >
                    Sauvegarder
                  </button>
                </form>
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

export default ListeRdvManager;
