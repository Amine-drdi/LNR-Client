import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoIosRefresh } from "react-icons/io";
import Swal from 'sweetalert2';
import { MdPhoneMissed } from "react-icons/md";
import { FaTimesCircle, FaCheckCircle, FaClock } from "react-icons/fa";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
function ListeContratsDirec() {
  const [contrats, setContrats] = useState([]);
  const [filteredContrats, setFilteredContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editContratId, setEditContratId] = useState(null);
  const [updatedContrat, setUpdatedContrat] = useState({});
  const [selectedCommercial, setSelectedCommercial] = useState('');  // État pour le commercial sélectionné
  const [commercials, setCommercials] = useState([]);  // Pour stocker la liste des commerciaux
  const compagnies = ["","Néoliane", "Assurema", "Alptis", "April", "Malakoff Humanis", "Cegema", "Swisslife" ,"Soly Azar" , "Zenio"];
  const etatDocs = ["" , "Validé", "Non validé", "NRP" , "Impayé", "Sans effet", "Rétractation", "Résigné"];
  const apporteurAffaires= ["","Cyrine Ben Aicha" , "Sihem Selemi", "Hajer Askri" , "Rim Dabebi" , "Eya Ben Jbara" , "Rihab Kouki" ,"Leads"];
  const payements = ["" , "Payé", "Pas payé" , "Future" , "Retrait de commission"];
  const typeResiliations = ["" , "Infra", "Résiliation à échéance"];
  const [selectedMonth, setSelectedMonth] = useState(''); 
  const [selectedDay, setSelectedDay] = useState(''); // State pour le jour

  const [selectedContrat, setSelectedContrat] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // État pour suivre si le mode d'édition est activé
  const [editedContrat, setEditedContrat] = useState({}); // État pour suivre le contrat modifié

  const handleEditModal = (contrat) => {
    setIsEditing(true); // Activer le mode d'édition
    setEditedContrat(contrat); // Charger les données du contrat à modifier
  };

  const handleSaveModal = async () => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/contrats/${editedContrat._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedContrat),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du contrat');
      }

      // Mettre à jour la liste des contrats après modification
      const updatedList = contrats.map((contrat) =>
        contrat._id === editedContrat._id ? editedContrat : contrat
      );
      setContrats(updatedList);
      setFilteredContrats(updatedList);

      setIsEditing(false); // Quitter le mode d'édition
      setShowModal(false); // Fermer le modal
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChangeModal = (e) => {
    setEditedContrat({ ...editedContrat, [e.target.name]: e.target.value });
  };

  // Charger les contrats au premier rendu

    const fetchContrats = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://51.83.69.195:5000/api/contrats');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contrats');
        }
        const data = await response.json();
        const validContrats = data.contrats.filter(contrat => contrat.signatureDate && contrat.signatureDate.trim() !== '');
        
        // Récupérer la liste unique des commerciaux
        const uniqueCommercials = [...new Set(validContrats.map(contrat => contrat.Commercial))];
        setCommercials(uniqueCommercials);

        setContrats(validContrats);
        setFilteredContrats(validContrats);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchContrats();
  }, []);

  // Filtrage par recherche
  useEffect(() => {
    const results = contrats.filter((contrat) =>
      `${contrat.nom} ${contrat.prenom} ${contrat.Commercial}` .toLowerCase().includes(searchTerm.toLowerCase())

    );
    setFilteredContrats(results);
  }, [searchTerm, contrats]);

  // Fonction pour extraire le mois à partir des formats de date "DD/MM/YY" ou "YYYY/MM/DD"
  const extractMonthFromDate = (dateString) => {
    if (!dateString) return null;

    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    const firstPart = parseInt(parts[0], 10);
    if (firstPart > 31) {
      return parseInt(parts[1], 10); // Format aaaa/mm/jj
    } else {
      return parseInt(parts[1], 10); // Format jj/mm/aaaa
    }
  };

  // Fonction pour activer le mode édition
const handleEditClick = (contrat) => {
  setEditContratId(contrat._id);
  setUpdatedContrat(contrat); // Pré-remplir les champs avec les données du contrat
};

// Fonction pour sauvegarder les modifications
const handleSaveClick = async (contratId) => {
  try {
    const response = await fetch(`http://51.83.69.195:5000/api/contrats/${contratId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedContrat),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du contrat');
    }

    // Mise à jour locale du contrat
    const updatedList = contrats.map((contrat) =>
      contrat._id === contratId ? updatedContrat : contrat
    );
    setContrats(updatedList);
    setFilteredContrats(updatedList); // Met à jour la liste filtrée
    setEditContratId(null); // Désactive le mode édition
  } catch (error) {
    setError(error.message);
  }
};
const handleViewContrat = (contrat) => {
  setSelectedContrat(contrat);  // Définir le contrat sélectionné pour l'afficher dans le modal
  setShowModal(true);  // Ouvrir le modal

};





const closeModal = () => {
  setShowModal(false);  // Fermer le modal
  setSelectedContrat(null);  // Réinitialiser l'état du contrat sélectionné
};

// Fonction pour supprimer un contrat


const handleDeleteClick = async (contratId) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Voulez-vous vraiment supprimer ce contrat ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/contrats/${contratId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du contrat');
      }

      // Supprimer le contrat localement
      const updatedList = contrats.filter((contrat) => contrat._id !== contratId);
      setContrats(updatedList);
      setFilteredContrats(updatedList); // Met à jour la liste filtrée

      Swal.fire('Supprimé!', 'Le contrat a été supprimé avec succès.', 'success');
    } catch (error) {
      setError(error.message);
    }
  }
};


  // Filtrage par mois et commercial
  useEffect(() => {
    const filtered = contrats.filter((contrat) => {
      const signatureMonth = extractMonthFromDate(contrat.signatureDate);
  
      const isCommercialMatch = selectedCommercial ? contrat.Commercial === selectedCommercial : true;

      return  isCommercialMatch;
    });
    setFilteredContrats(filtered);
  }, [contrats,  selectedCommercial]);

  const handleInputChange = (e) => {
    setUpdatedContrat({ ...updatedContrat, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e) => {
    setUpdatedContrat({ ...updatedContrat, [e.target.name]: e.target.value });
  };

  // Fonction pour filtrer les contrats par mois et jour
  useEffect(() => {
    const filterByDate = () => {
      if (selectedMonth === '' && selectedDay === '') {
        setFilteredContrats(contrats); // Afficher tous les contrats si aucun filtre n'est appliqué
      } else {
        const filtered = contrats.filter(contrat => {
          const [day, month, year] = contrat.signatureDate.split('/'); // Extraire le jour, mois, année
          const formattedMonth = month.length === 1 ? `0${month}` : month; // Formater le mois pour avoir deux chiffres
          const formattedDay = day.length === 1 ? `0${day}` : day; // Formater le jour pour avoir deux chiffres

          // Comparer à la fois le mois et le jour s'ils sont sélectionnés
          const monthMatches = selectedMonth ? formattedMonth === selectedMonth : true;
          const dayMatches = selectedDay ? formattedDay === selectedDay : true;

          return monthMatches && dayMatches;
        });
        setFilteredContrats(filtered);
      }
    };

    filterByDate();
  }, [selectedMonth, selectedDay, contrats]);


  const handleRefresh = () => {
    fetchContrats(); // Fetch the RDVs again when the button is clicked
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
      {/* Refresh Button */}
      <button 
        onClick={handleRefresh} 
        className="mb-4 px-4 py-2 bg-transparent text-blue-gray-700 rounded  flex items-center"
      >
        <IoIosRefresh className="mr-2" /> Actualiser
      </button>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        />
      </div>
      
    {/* Filtre par Date */}
    <div className="mb-4 flex space-x-4">

     {/* Sélecteur de jour */}

         <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        >
          <option value="">Tous les jours</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <option key={day} value={day < 10 ? `0${day}` : day}>
              {day}
            </option>
          ))}
        </select>
        {/* Filtre par mois */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
        >
          <option value="">Tous les mois</option>
          <option value="01">Janvier</option>
          <option value="02">Février</option>
          <option value="03">Mars</option>
          <option value="04">Avril</option>
          <option value="05">Mai</option>
          <option value="06">Juin</option>
          <option value="07">Juillet</option>
          <option value="08">Août</option>
          <option value="09">Septembre</option>
          <option value="10">Octobre</option>
          <option value="11">Novembre</option>
          <option value="12">Décembre</option>
        </select>


 
  {/* Displaying the total sum of cotisations */}
  <div className="mt-4 text-lg font-semibold text-blue-gray-700 pl-8 ">
    Total Montant VP/Mois: 
    <span className="text-green-500 pl-4">
    {filteredContrats.reduce((total, contrat) => {
      return total + parseFloat(contrat.cotisation || 0);
    }, 0).toFixed(2)} €
    </span>
  </div>

      </div>


      <div className="overflow-x-scroll">
      <table className="min-w-[1200px] w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
      
          <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">#</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">état du dossier</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Paiement</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date de Signature</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Numéro de téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Compagnie</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date d'Effet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Montant VP/mois</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Apporteur d'affaire</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Ancienne Mutuelle</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Type de résiliation</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Retour compagnie</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Suivi gestion</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Remarque gestionnaire</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire de l'agent</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire du gestionnaire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          {filteredContrats.slice().reverse().map((contrat, index) => (
              <tr key={contrat._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700 text-center">{filteredContrats.length - index}</td>
             <td className="px-4 py-3 text-sm text-gray-700">
             {editContratId === contrat._id ? (
              <button onClick={() => handleSaveClick(contrat._id)} className="text-blue-500">
              Sauvegarder
              </button>
               ) : (
               <div className="flex items-center space-x-2">
                <FaEye 
                 className="text-blue-500 cursor-pointer w-4 h-4" 
                 onClick={() => handleViewContrat(contrat)}
                />
                <FontAwesomeIcon
                 icon={faEdit}
                 className="text-indigo-600 cursor-pointer w-4 h-4"
                 onClick={() => handleEditClick(contrat)}
                />
                <FontAwesomeIcon
                 icon={faTrash}
                 className="text-red-500 cursor-pointer w-4 h-4"
                 onClick={() => handleDeleteClick(contrat._id)}
                />
               </div>
             )}
            </td>

            <td className="px-4 py-3 text-sm text-gray-700">
  {editContratId === contrat._id ? (
    <select
      name="etatDossier"
      value={updatedContrat.etatDossier}
      onChange={handleInputChange}
      className="border rounded-md p-2"
    >
      {etatDocs.map((etatDossier) => (
        <option
          key={etatDossier}
          value={etatDossier}
          className={etatDossier === "Validé" ? "text-green-500" :
                    etatDossier === "Non validé" ? "text-red-500" :
                    etatDossier === "NRP" ? "text-yellow-700" :
                    ""}
        >
          {etatDossier === "Validé" && <FaCheckCircle className="mr-2 text-green-500 inline-block" />}
          {etatDossier === "Non validé" && <FaTimesCircle className="mr-2 text-red-500 inline-block" />}
          {etatDossier === "NRP" && <MdPhoneMissed className="mr-2 text-yellow-700 inline-block" />}
          {etatDossier}
        </option>
      ))}
    </select>
  ) : (
    <span className={
      contrat.etatDossier === "Validé" ? "text-green-500" :
      contrat.etatDossier === "Non validé" ? "text-red-500" :
      contrat.etatDossier === "NRP" ? "text-yellow-700" :
      ""
    }>
      {contrat.etatDossier === "Validé" && <FaCheckCircle className="mr-2 text-green-500 inline-block" />}
      {contrat.etatDossier === "Non validé" && <FaTimesCircle className="mr-2 text-red-500 inline-block" />}
      {contrat.etatDossier === "NRP" && <MdPhoneMissed className="mr-2 w-5 h-5 text-yellow-700 inline-block" />}
      {contrat.etatDossier}
    </span>
  )}
</td>

<td className="px-4 py-3 text-sm">
  {editContratId === contrat._id ? (
    <select
      name="payement"
      value={updatedContrat.payement}
      onChange={handleInputChange}
      className="border rounded-md p-2"
    >
      {payements.map(payement => (
        <option key={payement} value={payement}>
          {payement}
        </option>
      ))}
    </select>
  ) : (
    <span
      className={`${
        contrat.payement === "Payé"
          ? "text-green-500"
          : contrat.payement === "Pas payé"
          ? "text-red-500"
          : contrat.payement === "Future"
          ? "text-blue-500"
          : contrat.payement === "Retrait de commission"
          ? "text-orange-700"
          : "text-gray-700"
      } flex items-center`}
    >
      {contrat.payement === "Pas payé" && (
        <MdCancel className="h-4 w-4 mr-2"/>
      )}
      {contrat.payement === "Payé" && (
        <FaCheck className="h-4 w-4 mr-2"/> /* Exemple avec FontAwesome */
      )}
      {contrat.payement === "Future" && (
        <FaPlus className="h-4 w-4 mr-2"/>
      )}
            {contrat.payement === "Retrait de commission" && (
        <AiOutlineMinusCircle className="h-4 w-4 mr-2"/>/* Exemple avec FontAwesome */
      )}
      {contrat.payement}
    </span>
  )}
</td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="nom"
                      value={updatedContrat.nom ? updatedContrat.nom.toUpperCase() : ''}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.nom ? contrat.nom.toUpperCase() : ''
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="prenom"
                      value={updatedContrat.prenom ? updatedContrat.prenom.toUpperCase() : ''}
                      onChange={handleInputChange}
                      className="border rounded-md p-2 text-black"
                    />
                  ) : (
                    contrat.prenom ? contrat.prenom.toUpperCase() : ''
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="signatureDate"
                      value={updatedContrat.signatureDate}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.signatureDate
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="email"
                      value={updatedContrat.email}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.email
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="telephone"
                      value={updatedContrat.telephone}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.telephone
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                 {editContratId === contrat._id ? (
                <select
                  name="compagnie"
                  value={updatedContrat.compagnie}
                  onChange={handleInputChange}
                  className="border rounded-md p-2"
                 >
                 {compagnies.map(compagnie => (
                 <option key={compagnie} value={compagnie}>
                 {compagnie}
                 </option>
                 ))}
                 </select>
                 ) : (
                 contrat.compagnie
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                  <input
                  type="text"
                  name="Commercial"
                  value={updatedContrat.Commercial}
                  onChange={handleInputChange}
                  className="border rounded-md p-2"
                  />
                 ) : (
                contrat.Commercial
                 )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="effetDate"
                      value={updatedContrat.effetDate}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.effetDate
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                  <input
                  type="text"
                  name="cotisation"
                  value={updatedContrat.cotisation}
                  onChange={handleInputChange}
                  className="border rounded-md p-2"
                  />
                 ) : (
                contrat.cotisation
                 )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                 {editContratId === contrat._id ? (
                <select
                  name="apporteurAffaire"
                  value={updatedContrat.apporteurAffaire}
                  onChange={handleInputChange}
                  className="border rounded-md p-2"
                 >
                 {apporteurAffaires.map(apporteurAffaire => (
                 <option key={apporteurAffaire} value={apporteurAffaire}>
                 {apporteurAffaire}
                 </option>
                 ))}
                 </select>
                 ) : (
                 contrat.apporteurAffaire
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                  <input
                  type="text"
                  name="ancienneMutuelle"
                  value={updatedContrat.ancienneMutuelle}
                  onChange={handleInputChange}
                  className="border rounded-md p-2"
                  />
                 ) : (
                contrat.ancienneMutuelle
                 )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                 {editContratId === contrat._id ? (
                <select
                  name="typeResiliation"
                  value={updatedContrat.typeResiliation}
                  onChange={handleInputChange}
                  className="border rounded-md p-2"
                 >
                 {typeResiliations.map(typeResiliation => (
                 <option key={typeResiliation} value={typeResiliation}>
                 {typeResiliation}
                 </option>
                 ))}
                 </select>
                 ) : (
                 contrat.typeResiliation
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="retourCompagnie"
                      value={updatedContrat.retourCompagnie}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.retourCompagnie
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="suiviGestion"
                      value={updatedContrat.suiviGestion}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.suiviGestion
                  )}
                </td>
 
                <td className="px-4 py-3 text-sm text-red-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="remarque"
                      value={updatedContrat.remarque}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.remarque
                  )}
                </td>
                
                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="comment"
                      value={updatedContrat.commentaire}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.commentaire
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {editContratId === contrat._id ? (
                    <input
                      type="text"
                      name="commentaireAgent"
                      value={updatedContrat.commentaireAgent}
                      onChange={handleInputChange}
                      className="border rounded-md p-2"
                    />
                  ) : (
                    contrat.commentaireAgent
                  )}
                </td>
             

              </tr>
            ))}
          </tbody>

          
        </table>

      </div>

      {/* Modal */}
      {showModal && selectedContrat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 overflow-y-auto max-h-screen">
            <h2 className="text-2xl text-blue-500 font-semibold mb-4">
              {isEditing ? "Modifier le Contrat" : "Détails du Contrat"}
            </h2>

            {!isEditing ? (
              <>

            <p className='text-left'><strong>État du dossier :</strong> {selectedContrat.etatDossier}</p>
            <p className='text-left'><strong>État du dossier :</strong> {selectedContrat.payement}</p>
            <p className='text-left'><strong>Nom:</strong> {selectedContrat.nom ? selectedContrat.nom.toUpperCase() : ''}</p>
            <p className='text-left'><strong>Prénom:</strong> {selectedContrat.prenom ? selectedContrat.prenom.toUpperCase() : ''}</p>
            <p className='text-left'><strong>Date de Signature :</strong> {selectedContrat.signatureDate}</p>
            <p className='text-left'><strong>Email:</strong> {selectedContrat.email}</p>
            <p className='text-left'><strong>Téléphone :</strong> {selectedContrat.telephone}</p>
            <p className='text-left'><strong>Compagnie :</strong> {selectedContrat.compagnie}</p>
            <p className='text-left'><strong>Commercial :</strong> {selectedContrat.Commercial}</p>
            <p className='text-left'><strong>Date d'Effet :</strong> {selectedContrat.effetDate}</p>
            <p className='text-left'><strong>Montant VP/mois :</strong> {selectedContrat.cotisation}</p>
            <p className='text-left'><strong>Apporteur d'affaire :</strong> {selectedContrat.apporteurAffaire}</p>
            <p className='text-left'><strong>Ancienne mutuelle :</strong> {selectedContrat.ancienneMutuelle}</p>
            <p className='text-left'><strong>Type de résiliation:</strong> {selectedContrat.typeResiliation}</p>
            <p className='text-left'><strong>Retour compagnie :</strong> {selectedContrat.retourCompagnie}</p>
            <p className='text-left'><strong>Suivi gestion :</strong> {selectedContrat.suiviGestion}</p>
            <p className='text-left'><strong>Remarque :</strong> {selectedContrat.remarque}</p>
            <p className='text-left'><strong>Commentaire du gestionnaire :</strong> {selectedContrat.commentaire}</p>
            <p className='text-left'><strong>Commentaire de l'agent :</strong> {selectedContrat.commentaireAgent}</p>
            
                <button
                  onClick={() => handleEditModal(selectedContrat)}
                  className="mt-4 px-4 py-2  bg-blue-500 text-white rounded hover:bg-blue-800 mr-2"
                >
                  Modifier
                </button>
           
              </>
            ) : (
              <>
                <div className="flex flex-col">
                <label className='font-semibold '>État du dossier : </label>
                <select
                 value={updatedContrat.etatDossier || selectedContrat.etatDossier} // Initialisation avec la valeur existante
                 name="etatDossier"
                 onChange={handleInputChangeModal} // Fonction de gestion pour mettre à jour le contrat
                 className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Choisissez une option</option>
                  <option value="Validé">Validé</option>
                  <option value="Non validé">Non validé</option>
                  <option value="NRP">NRP</option>
                  <option value="Rétractation">Rétractation</option>
                  <option value="Résigné">Résigné</option>
                </select>
                </div>
                <div className="flex flex-col">
                <label className='font-semibold '>Paiement : </label>
                <select
                 value={updatedContrat.payement && selectedContrat.payement} // Initialisation avec la valeur existante
                 name="payement"
                 onChange={handleInputChangeModal} // Fonction de gestion pour mettre à jour le contrat
                 className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Choisissez une option</option>
                  <option value="Payé">Payé</option>
                  <option value="Pas payé">Pas payé</option>
                  <option value="Future">Future</option>
                  <option value="Retrait de commission">Retrait de commission</option>
                </select>
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Nom :</label>
                  <input
                    type="text"
                    name="nom"
                    value={editedContrat.nom}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Prénom :</label>
                  <input
                    type="text"
                    name="prenom"
                    value={editedContrat.prenom}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Date de signature :</label>
                  <input
                    type="text"
                    name="signatureDate"
                    value={editedContrat.signatureDate}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Email :</label>
                  <input
                    type="text"
                    name="email"
                    value={editedContrat.email}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Téléphone :</label>
                  <input
                    type="text"
                    name="telephone"
                    value={editedContrat.telephone}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Compagnie :</label>
                  <select
                 value={updatedContrat.compagnie || selectedContrat.compagnie} // Initialisation avec la valeur existante
                 name="compagnie"
                 onChange={handleInputChangeModal} // Fonction de gestion pour mettre à jour le contrat
                 className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Choisissez une option</option>
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
                <div className="flex flex-col">
                  <label className='font-semibold '>Commercial :</label>
                  <input
                    type="text"
                    name="commercial"
                    value={editedContrat.Commercial}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Date d'Effet :</label>
                  <input
                    type="num"
                    name="effetDate"
                    value={editedContrat.effetDate}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Montant VP/mois :</label>
                  <input
                    type="num"
                    name="cotisation"
                    value={editedContrat.cotisation}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Apporteur d'affaire :</label>
                  <select
                 value={updatedContrat.apporteurAffaire || selectedContrat.apporteurAffaire} // Initialisation avec la valeur existante
                 name="typeResiliation"
                 onChange={handleInputChangeModal} // Fonction de gestion pour mettre à jour le contrat
                 className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Choisissez une option</option>
                  <option value="Sihem Selemi">Sihem Selemi</option>
                  <option value="Hajer Askri">Hajer Askri	</option>
                  <option value="Rim Dabebi">Rim Dabebi</option>
                  <option value="Rihab Kouki">Rihab Kouki</option>
                  <option value="Eric">Eric</option>

                </select>
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Ancienne mutuelle :</label>
                  <input
                    type="text"
                    name="ancienneMutuelle"
                    value={editedContrat.ancienneMutuelle}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Type de résiliation :</label>
                  <select
                 value={updatedContrat.typeResiliation || selectedContrat.typeResiliation} // Initialisation avec la valeur existante
                 name="typeResiliation"
                 onChange={handleInputChangeModal} // Fonction de gestion pour mettre à jour le contrat
                 className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Choisissez une option</option>
                  <option value="Infra">Infra</option>
                  <option value="Résiliation à échéance">Résiliation à échéance</option>

                </select>
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Retour compagnie :</label>
                  <input
                    type="text"
                    name="retourComagnie"
                    value={editedContrat.retourCompagnie}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Suivi gestion :</label>
                  <input
                    type="text"
                    name="suiviGestion"
                    value={editedContrat.suiviGestion}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Remarque :</label>
                  <input
                    type="text"
                    name="remarque"
                    value={editedContrat.remarque}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Commentaire du gestionnaire :</label>
                  <input
                    type="text"
                    name="commentaire"
                    value={editedContrat.commentaire}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Commentaire de l'agent :</label>
                  <input
                    type="text"
                    name="commentaireAgent"
                    value={editedContrat.commentaireAgent}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                {/* Autres champs éditables */}
                <button
                  onClick={handleSaveModal}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Sauvegarder
                </button>
              </>
            )}

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeContratsDirec;