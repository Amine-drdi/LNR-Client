
import React, { useState, useEffect } from 'react';
import { Textarea } from '@material-tailwind/react';
import { CgAttachment } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from 'axios';
const Chat = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userMatricule, setUserMatricule] = useState('');
   const navigate = useNavigate();
  const backendURL = 'http://51.83.69.195:5000'; // URL du serveur backend

  // Récupération des utilisateurs
  useEffect(() => {
    fetch(`${backendURL}/api/userschat`)
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  // Récupération des messages
  const fetchMessages = () => {
    if (currentReceiver) {
      fetch(`${backendURL}/api/messages/${currentUser.matricule}/${currentReceiver}`)
        .then((res) => res.json())
        .then(setMessages)
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Rafraîchir les messages toutes les 3 secondes
    return () => clearInterval(interval);
  }, [currentReceiver]);

  // Envoi d'un message
  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) {
      console.error('Le message est vide et aucun fichier n\'est sélectionné');
      return;
    }

    const formData = new FormData();
    formData.append('sender', currentUser.matricule);
    formData.append('receiver', currentReceiver);
    formData.append('content', newMessage.trim());
    if (selectedFile) formData.append('file', selectedFile);

    try {
      const response = await fetch(`${backendURL}/api/messages`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const message = await response.json();
      setMessages([...messages, message]);
      setNewMessage('');
      setSelectedFile(null);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message :', err);
    }
  };

  const isFileViewable = (fileUrl) => {
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt', 'html'].includes(fileExtension);
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
  
          console.log("Profil récupéré:", response.data.user);
  
          setUserName(response.data.user.name);
          setUserRole(response.data.user.role);
          setUserMatricule(response.data.user.matricule);
          currentUser.id = response.data.user._id; // Assigner l'ID
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
  


const deleteMessage = async (messageId) => {
  if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
  console.log("Tentative de suppression du message ID:", messageId);
  console.log("User ID envoyé:", currentUser.id);
  try {
    const response = await fetch(`${backendURL}/api/messages/${messageId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression.');
    }

    setMessages(messages.filter(msg => msg._id !== messageId));
  } catch (error) {
    console.error('Erreur :', error);
  }
};

  

  return (
    <div className="flex h-screen">
      {/* Liste des utilisateurs */}
      <div className="w-1/4 bg-gray-100 h-full overflow-y-auto border-r">
        <ul>
          {users.map((user) => (
            <li
              key={user.matricule}
              onClick={() => setCurrentReceiver(user.matricule)}
              className="p-4 cursor-pointer hover:bg-gray-200 border-b"
            >
              {user.name || 'Utilisateur'}
            </li>
          ))}
        </ul>
      </div>

      {/* Fenêtre de discussion */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4 flex flex-col space-y-3 overflow-y-auto">
        {messages.map((msg, index) => (
  <div key={index} className={`flex ${msg.sender === currentUser.matricule ? 'justify-end' : 'justify-start'}`}>
    <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === currentUser.matricule ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
      {msg.content}
      {msg.fileUrl && (
        <div className="mt-2">
          <a href={`${backendURL}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-500">
            Voir le fichier
          </a>
        </div>
      )}
    </div>

        {/* Afficher le bouton uniquement si l'utilisateur a le rôle et est l'expéditeur */}
        {['Gestionnaire', 'Administrateur'].includes(userRole) && msg.sender === currentUser.matricule && (
      <button onClick={() => deleteMessage(msg._id)} className="ml-2 text-red-500 hover:text-red-700">
        <RiDeleteBin6Line className='text-red-500'/>
      </button>
    )}
  </div>
))}

        </div>

        {currentReceiver ? (
          <div className="w-full border-t p-4 flex space-x-2 items-center">
            <Textarea
              color="blue"
              label="Tapez votre message ici ..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <CgAttachment className="text-gray-700 text-3xl" />
            </label>
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Envoyer
            </button>
          </div>
        ) : (
          <div className="p-4 text-gray-500">Sélectionnez un utilisateur pour commencer la discussion.</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
