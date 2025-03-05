import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function ListeEmpGest() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://51.83.69.195:5000/api/users');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data = await response.json();
        console.log(data.users); // Vérifier la structure des données et les rôles
        setUsers(data.users);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setUpdatedUser(user);
  };

  const handleSaveClick = async (id) => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
      }

      const updatedList = users.map((user) =>
        user._id === id ? updatedUser : user
      );
      setUsers(updatedList);
      setEditUserId(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur');
      }

      const updatedList = users.filter((user) => user._id !== id);
      setUsers(updatedList);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur : {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-blue-gray-400 border-b">
            <tr>
              <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">Nom et prénom</th>
              <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">Numero ID</th>
              <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">Mot de Passe</th>
              <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">Rôle</th>
              <th className="px-4 py-2 text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
  {users
    .filter((user) => user.role !== 'Gestionnaire' && user.role !== 'Direction') // Exclure les rôles "Gestionnaire" et "Direction"
    .map((user) => (
      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm text-gray-700">
          {editUserId === user._id ? (
            <input
              type="text"
              name="name"
              value={updatedUser.name}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          ) : (
            user.name
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700">
          {editUserId === user._id ? (
            <input
              type="text"
              name="matricule"
              value={updatedUser.matricule}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          ) : (
            user.matricule
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700">
          {editUserId === user._id ? (
            <input
              type="password"
              name="password"
              value={updatedUser.password}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          ) : (
            '••••••••'
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700">
          {editUserId === user._id ? (
            <input
              type="text"
              name="role"
              value={updatedUser.role}
              onChange={handleInputChange}
              className="border rounded-md p-2"
            />
          ) : (
            user.role
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
          {editUserId === user._id ? (
            <button onClick={() => handleSaveClick(user._id)} className="text-blue-500">
              Sauvegarder
            </button>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faEdit}
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEditClick(user)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="text-red-500 cursor-pointer"
                onClick={() => handleDeleteUser(user._id)}
              />
            </>
          )}
        </td>
      </tr>
    ))}
</tbody>

        </table>
      </div>
    </div>
  );
  
}

export default ListeEmpGest;
