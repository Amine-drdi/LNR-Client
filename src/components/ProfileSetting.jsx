import React, { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Importation des icônes Heroicons

function ProfileSetting() {
  const [user, setUser] = useState({
    matricule: '',
    name: '',
    password: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour la visibilité du mot de passe

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://51.83.69.195:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Erreur lors du chargement des informations utilisateur', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://51.83.69.195:5000/api/users/${user._id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage('Informations mises à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Paramètres du Profil</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Identifiant</label>
          <input
            type="text"
            name="matricule"
            value={user.matricule}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Entrez votre identifiant"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Entrez votre nom"
          />
        </div>

        <div className="relative">
          <label className="block text-gray-700 font-semibold mb-2">Mot de passe</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Entrez votre nouveau mot de passe"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-12 right-3 flex items-center text-gray-500 hover:text-gray-700 transition duration-200 "
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 " />
            ) : (
              <EyeIcon className="h-5 w-5 " />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-gray-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-gray-800 transition duration-200"
        >
          Mettre à jour
        </button>

        {successMessage && (
          <p className="text-green-600 text-center mt-4">{successMessage}</p>
        )}
      </form>
    </div>
  );
}

export default ProfileSetting;
