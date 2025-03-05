import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';


function ListeEnergieManager() {
  const [energies, setEnergies] = useState([]);
  const [filteredEnergies, setFilteredEnergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnergie, setSelectedEnergie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEnergies = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/energies');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setEnergies(data); // Assurez-vous que data est correctement formaté
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEnergies();
  }, []);
  
  useEffect(() => {
    const results = energies.filter((energie) =>
      `${energie.nom} ${energie.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnergies(results);
  }, [searchTerm, energies]);

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const handleViewEnergie = (Energie) => {
    setSelectedEnergie(Energie);
    setFormData(Energie);
    setShowModal(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
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
      const response = await fetch(`http://51.83.69.195:5000/api/energies/${selectedEnergie._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des données');
      }

      setEnergies((prevEnergies) =>
        prevEnergies.map((energy) => (energy._id === selectedEnergie._id ? formData : energy))
      );

      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }
  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-left text-blue-gray-700 mb-6 border-b pb-4">Liste des Souscriptions</h1>
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
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Adresse</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Code Postal</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Ville</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date Prise RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Heure RDV</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire Agent</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire manager</th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          {filteredEnergies.slice().reverse().map((Energie, index) => (
              <tr key={Energie._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 text-center">{filteredEnergies.length - index}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <FaEye className="text-blue-500 cursor-pointer w-4 h-4" onClick={() => handleViewEnergie(Energie)} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.userName}</td>
               
                <td
                   className={`px-4 py-3 text-sm ${
                    Energie.rdvType === 'Physique' ? 'text-green-500' : Energie.rdvType === 'Téléphonique' ? 'text-blue-700' : Energie.rdvType === 'Siège' ? 'text-orange-700' : 'text-gray-700'
                   }`}
                >
                 {Energie.rdvType}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">{Energie.nom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.prenom}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.telephone}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.adresse}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.codePostal}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.ville}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.datePriseRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.dateRDV}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.heureRDV}</td>
                <td className="px-4 py-3 text-sm text-blue-700">{Energie.commentaireAgent}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{Energie.commentaireManager}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedEnergie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 overflow-y-auto max-h-screen">
            {!isEditing ? (
              <>
                <h2 className="text-2xl text-blue-500 font-semibold mb-4">Détails du Rendez-vous</h2>
                <p className="text-left"><strong>Agent :</strong> {selectedEnergie.userName}</p>
                <p className="text-left"><strong>Type Rendez-vous :</strong>
              <span className={`${selectedEnergie.EnergieType === 'Physique' ? 'text-green-500' : selectedEnergie.EnergieType === 'Téléphonique' ? 'text-blue-700' :selectedEnergie.EnergieType === 'Siège' ? 'text-orange-700' : 'text-gray-700'}`}>
               {selectedEnergie.EnergieType}
              </span>
              </p>
                <p className="text-left"><strong>Nom :</strong> {selectedEnergie.nom}</p>
                <p className="text-left"><strong>Prénom :</strong> {selectedEnergie.prenom}</p>
                <p className="text-left"><strong>Téléphone :</strong> {selectedEnergie.telephone}</p>
                <p className="text-left"><strong>Email :</strong> {selectedEnergie.email}</p>
                <p className="text-left"><strong>Adresse :</strong> {selectedEnergie.adresse}</p>
                <p className="text-left"><strong>Code postal :</strong> {selectedEnergie.codePostal}</p>
                <p className="text-left"><strong>Ville:</strong> {selectedEnergie.ville}</p>
                <p className="text-left"><strong>Formation :</strong> {selectedEnergie.formation}</p>
                <p className="text-left"><strong>Date prise RDV:</strong> {selectedEnergie.datePriseRDV}</p>
                <p className="text-left"><strong>Date RDV :</strong> {selectedEnergie.dateRDV}</p>
                <p className="text-left"><strong>Heure RDV :</strong> {selectedEnergie.heureRDV}</p>
                <p className="text-left"><strong>Commentaire Agent :</strong> {selectedEnergie.commentaireAgent}</p>
                <p className="text-left"><strong>Commentaire Manager :</strong> {selectedEnergie.commentaireManager}</p>


                
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
                    <span className="text-gray-700">Date prise RDV:</span>
                    <input
                      name="datePriseRDV"
                      value={formData.datePriseRDV}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Date RDV:</span>
                    <input
                      name="dateRDV"
                      value={formData.dateRDV}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-gray-700">Heure RDV:</span>
                    <input
                      name="heureRDV"
                      value={formData.heureRDV}
                      onChange={handleInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                    />
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

export default ListeEnergieManager;
