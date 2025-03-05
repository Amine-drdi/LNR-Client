import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoIosRefresh } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaCheckCircle, FaTimesCircle} from 'react-icons/fa';
import { MdPhoneMissed } from "react-icons/md";
import { AiOutlineMinusCircle } from "react-icons/ai";
function ListeContratsGestio() {
  const [contrats, setContrats] = useState([]);
  const [filteredContrats, setFilteredContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editContratId, setEditContratId] = useState(null);
  const [updatedContrat, setUpdatedContrat] = useState({});
  const compagnies = ["" , "Néoliane", "Assurema", "Alptis", "April", "Malakoff Humanis", "Cegema", "Swisslife"];
  const etatDocs = ["" , "Validé", "Non validé","NRP" , "Sans effet", "Rétractation", "Résigné"];
  const payements = ["" , "Payé", "Pas payé" , "Future" , "Retrait de commission"];
  const typeResiliations= ["" , "Infra", "Résiliation à échéance"];
  const apporteurAffaires= ["Cyrine Ben Aicha" , "Sihem Selemi", "Hajer Askri" , "Rim Dabebi" , "Eya Ben Jbara" , "Rihab Kouki" ,"Leads"];
  const [selectedMonth, setSelectedMonth] = useState(''); //state pour le mois
  const [selectedDay, setSelectedDay] = useState(''); // State pour le jour
  const [selectedContrat, setSelectedContrat] = useState(null); // Contrat sélectionné pour le modal
  const [showModal, setShowModal] = useState(false); // Contrôle du modal
  const [isEditing, setIsEditing] = useState(false); // État pour suivre si le mode d'édition est activé
  const [editedContrat, setEditedContrat] = useState({}); // État pour suivre le contrat modifié
  const [priseUsers, setPriseUsers] = useState([]);
  const [selectedPrise, setSelectedPrise] = useState('');
  const [commercialUsers, setCommercialUsers] = useState([]);
  const [selectedCommercial, setSelectedCommercial] = useState('');
  const [selectedCompagnie, setSelectedCompagnie] = useState('');
  const handleEditModal = (contrat) => {
    setIsEditing(true); // Activer le mode d'édition
    setEditedContrat(contrat); // Charger les données du contrat à modifier
  };

  useEffect(() => {
    const fetchCommercialUsers = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/users');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data = await response.json();
        const commercialUsers = data.filter(user => user.role === 'Commerciale' );
        setCommercialUsers(commercialUsers);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchCommercialUsers();
  }, []);

  useEffect(() => {
    const fetchPriseUsers = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/usersPrise');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data = await response.json();
        const priseUsers = data.filter(user => user.role === 'Prise' );
        setPriseUsers(priseUsers);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchPriseUsers();
  }, []);

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

  
    const fetchContrats = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://51.83.69.195:5000/api/contrats');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des contrats');
        }
        const data = await response.json();
  
        // Filtrer les contrats dès la récupération pour exclure ceux sans date de signature
        const validContrats = data.contrats.filter(contrat => contrat.signatureDate && contrat.signatureDate.trim() !== '');
  
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
  

  useEffect(() => {
    const results = contrats.filter((contrat) =>
      `${contrat.nom} ${contrat.prenom} ${contrat.Commercial}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContrats(results);
  }, [searchTerm, contrats]);

  const handleEditClick = (contrat) => {
    setEditContratId(contrat._id);
    setUpdatedContrat(contrat);
  };
  

  const handleSaveClick = async (id) => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/contrats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContrat),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du contrat');
      }

      const updatedList = contrats.map((contrat) =>
        contrat._id === id ? updatedContrat : contrat
      );
      setContrats(updatedList);
      setEditContratId(null);
    } catch (error) {
      setError(error.message);
    }
  };


  
  
  
   
  
    // Filtrage selon le commercial, la recherche et le mois
    useEffect(() => {
      const filtered = contrats.filter((contrat) => {
        if (!contrat.signatureDate) return false; // S'assurer que la date de signature existe
    
        const signatureDate = new Date(contrat.signatureDate); // Créer un objet Date à partir de la chaîne de date
        const signatureMonth = signatureDate.getMonth() + 1; // Obtenir le mois de 1 à 12

    
      });
    
      setFilteredContrats(filtered);
    }, [contrats]);
    
  const handleInputChange = (e) => {
    setUpdatedContrat({ ...updatedContrat, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e) => {
    setUpdatedContrat({ ...updatedContrat, [e.target.name]: e.target.value });
  };
    const handleViewContrat = (contrat) => {
      setSelectedContrat(contrat); // Définir le contrat sélectionné
      setShowModal(true); // Afficher le modal
    };
  
    const closeModal = () => {
      setShowModal(false); // Fermer le modal
    };

   // Fonction pour filtrer les contrats par mois et jour
   const filterByDateAndCommercial = () => {
    if (!contrats || !Array.isArray(contrats)) {
      setFilteredContrats([]);
      return;
    }
  
    let filtered = contrats;
  
    // Vérification de searchTerm
    if (searchTerm) {
      filtered = filtered.filter((contrat) =>
        `${contrat.nom || ""} ${contrat.prenom || ""} ${contrat.Commercial || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
  
    // Filtre par mois et jour
    if (selectedMonth || selectedDay) {
      filtered = filtered.filter(contrat => {
        if (!contrat.signatureDate) return false;
  
        const [day, month] = contrat.signatureDate.split('/');
        const formattedMonth = month.padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
  
        const monthMatches = selectedMonth ? formattedMonth === selectedMonth : true;
        const dayMatches = selectedDay ? formattedDay === selectedDay : true;
  
        return monthMatches && dayMatches;
      });
    }
  
    // Filtre par commercial
    if (selectedCommercial) {
      filtered = filtered.filter(contrat =>
        (contrat.Commercial || "").toLowerCase() === (selectedCommercial || "").toLowerCase()
      );
    }

      // Filtre par agnet prise
      if (selectedPrise) {
        filtered = filtered.filter(contrat =>
          (contrat.apporteurAffaire || "").toLowerCase() === (selectedPrise || "").toLowerCase()
        );
      }

    // Filtre par compagnie
    if (selectedCompagnie) {
      filtered = filtered.filter(contrat =>
        (contrat.compagnie || "").toLowerCase() === (selectedCompagnie || "").toLowerCase()
      );
    }
    
  
    setFilteredContrats(filtered);
  };
  useEffect(() => {
    if (contrats.length > 0) {
      filterByDateAndCommercial();
    }
  }, [searchTerm, selectedMonth, selectedDay, selectedCommercial, selectedPrise , selectedCompagnie, contrats]);
  

  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedMonth('');
    setSelectedDay('');
    setSelectedCommercial('');
    setSelectedPrise('');
    setSelectedCompagnie('');
    fetchContrats();
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des contrats...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-blue-gray-50 rounded-lg shadow-lg" translate="no">
      <h1 className="text-3xl font-semibold text-left  text-blue-gray-700 mb-6 border-b pb-4 ">Liste des Contrats</h1>
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

  {/* Filtre par commercial */}
  <select
    value={selectedCommercial}
    onChange={(e) => setSelectedCommercial(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
  >
    <option value="">Tous les commerciaux</option>
    {commercialUsers.map(user => (
      <option key={user._id} value={user.name}>
        {user.name}
      </option>
    ))}
  </select>

  <select
    value={selectedPrise}
    onChange={(e) => setSelectedPrise(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
  >
    <option value="">Tous les agents prise</option>
    {priseUsers.map(user => (
      <option key={user._id} value={user.name}>
        {user.name}
      </option>
    ))}
  </select>
 
  {/* Filtre par company */}
  <select
    value={selectedCompagnie}
    onChange={(e) => setSelectedCompagnie(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
  >
    <option value="">Tous les compagnies</option>
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
      <div className="overflow-x-scroll">
      <table className="min-w-[1200px] w-full bg-white border border-gray-200 rounded-lg shadow-md whitespace-nowrap">
      
          <thead className="bg-blue-gray-500 border-b w-full">
            <tr>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">#</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">état du dossier</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">paiement</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date de Signature</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Numéro de téléphone</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Compagnie</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commercial</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Date d'Effet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Montant VP/mois</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Apporteur d'affaire</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Ancienne Mutuelle</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Type de résiliation</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Retour compagnie</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Suivi gestion</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Remarque</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire du Gestionnaire</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">Commentaire de l'Agent</th>
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
                        className="text-indigo-700 cursor-pointer mr-2 w-4 h-4" 
                        onClick={() => handleEditClick(contrat)}
                      /> 

                    </div>
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
  {editContratId === contrat._id ? (
    <select
      name="etatDossier"
      value={updatedContrat.etatDossier}
      onChange={handleSelectChange}
      className="border rounded-md p-2"
    >
      {etatDocs.map((etatDossier) => (
        <option
          key={etatDossier}
          value={etatDossier}
          className={etatDossier === "Validé" ? "text-green-500" :
                    etatDossier === "Non validé" ? "text-red-500" :
                    etatDossier === "NRP" ? "text-yellow-500" :
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

<td className="px-4 py-3 text-sm text-gray-700">
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
      {contrat.payement === "Payé" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      {contrat.payement === "Pas payé" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      {contrat.payement === "Future" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v14M5 12h14"
          />
        </svg>
      )}
            {contrat.payement === "Retrait de commission" && (
       
          <AiOutlineMinusCircle className="h-5 w-5 mr-2"/>
        
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
                  onChange={handleSelectChange}
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
                  onChange={handleSelectChange}
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
                  onChange={handleSelectChange}
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
            <p className='text-left'><strong>Paiement :</strong> {selectedContrat.payement}</p>
            <p className='text-left'><strong>Nom:</strong> {selectedContrat.nom ? selectedContrat.nom.toUpperCase() : ''}</p>
            <p className='text-left'><strong>Prénom:</strong> {selectedContrat.prenom ? selectedContrat.prenom.toUpperCase() : ''}</p>
            <p className='text-left'><strong>Date de Signature :</strong> {selectedContrat.signatureDate}</p>
            <p className='text-left'><strong>Email:</strong> {selectedContrat.email}</p>
            <p className='text-left'><strong>Téléphone :</strong> {selectedContrat.telephone}</p>
            <p className='text-left'><strong>Compagnie :</strong> {selectedContrat.compagnie}</p>
            <p className='text-left'><strong>Commercial :</strong> {selectedContrat.Commercial}</p>
            <p className='text-left'><strong>Date d'Effet :</strong> {selectedContrat.effetDate}</p>
            <p className='text-left'><strong>Montant VP/mois :</strong> {selectedContrat.cotisation}</p>
            <p className='text-left'><strong>Ancienne mutuelle :</strong> {selectedContrat.ancienneMutuelle}</p>
            <p className='text-left'><strong>Apporteur d'affaire :</strong> {selectedContrat.apporteurAffaire}</p>
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
                 value={updatedContrat.etatDossier && selectedContrat.etatDossier} // Initialisation avec la valeur existante
                 name="etatDossier"
                 onChange={handleInputChangeModal} // Fonction de gestion pour mettre à jour le contrat
                 className="w-full border border-gray-300 rounded p-2"
                > <option value="">Choisissez une option</option>
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
                    value={updatedContrat.nom && selectedContrat.nom}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Prénom :</label>
                  <input
                    type="text"
                    name="prenom"
                    value={updatedContrat.prenom && selectedContrat.prenom}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Date de signature :</label>
                  <input
                    type="text"
                    name="signatureDate"
                    value={updatedContrat.signatureDate && selectedContrat.signatureDate}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Email :</label>
                  <input
                    type="text"
                    name="email"
                    value={updatedContrat.email && selectedContrat.email}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Téléphone :</label>
                  <input
                    type="text"
                    name="telephone"
                    value={updatedContrat.telephone && selectedContrat.telephone}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Compagnie :</label>
                  <select
                 value={updatedContrat.compagnie && selectedContrat.compagnie} // Initialisation avec la valeur existante
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
                    value={updatedContrat.Commercial && selectedContrat.Commercial}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Date d'Effet :</label>
                  <input
                    type="num"
                    name="effetDate"
                    value={updatedContrat.effetDate && selectedContrat.effetDate}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Montant VP/mois :</label>
                  <input
                    type="num"
                    name="cotisation"
                    value={updatedContrat.cotisation && selectedContrat.cotisation}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Apporteur d'affaire :</label>
                  <select
                 value={updatedContrat.apporteurAffaire && selectedContrat.apporteurAffaire} // Initialisation avec la valeur existante
                 name="apporteurAffaire"
                 onChange={handleInputChangeModal} // Fonction de gestion pour mettre à jour le contrat
                 className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="">Choisissez une option</option>
                  <option value="Cyrine Ben Aicha">Cyrine Ben Aicha</option>
                  <option value="Sihem Selemi">Sihem Selemi</option>
                  <option value="Hajer Askri">Hajer Askri</option>
                  <option value="Rim Dabebi">Rim Dabebi</option>
                  <option value="Eya Ben Jbara">Eya Ben Jbara</option>
                  <option value="Rihab Kouki">Rihab Kouki</option>
                  <option value="Eric">Eric</option>
                  <option value="Leads">Leads </option>
                </select>
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Ancienne mutuelle :</label>
                  <input
                    type="text"
                    name="ancienneMutuelle"
                    value={updatedContrat.ancienneMutuelle && selectedContrat.ancienneMutuelle}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Type de résiliation :</label>
                  <select
                 value={updatedContrat.typeResiliation && selectedContrat.typeResiliation} // Initialisation avec la valeur existante
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
                    value={updatedContrat.retourCompagnie && selectedContrat.retourCompagnie}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Suivi gestion :</label>
                  <input
                    type="text"
                    name="suiviGestion"
                    value={updatedContrat.suiviGestion && selectedContrat.suiviGestion}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Remarque :</label>
                  <input
                    type="text"
                    name="remarque"
                    value={updatedContrat.remarque && selectedContrat.remarque}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Commentaire du gestionnaire :</label>
                  <input
                    type="text"
                    name="commentaire"
                    value={updatedContrat.commentaire && selectedContrat.commentaire}
                    onChange={handleInputChangeModal}
                    className="border p-2 rounded mb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className='font-semibold '>Commentaire de l'agent :</label>
                  <input
                    type="text"
                    name="commentaireAgent"
                    value={updatedContrat.commentaireAgent && selectedContrat.commentaireAgent}
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

export default ListeContratsGestio;