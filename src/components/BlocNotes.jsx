import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
function BlocNotes() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [Name, setName] = useState('');
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
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
          setName(response.data.user.name);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        navigate('/');
      }
    };
    fetchProfile();
  }, [navigate]);
  // Charger les notes depuis le serveur
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://51.83.69.195:5000/notes?Name=${Name}`);
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des notes :", error);
      }
    };
  
    if (Name) {
      fetchNotes(); // Appelle fetchNotes seulement si Name est défini
    }
  }, [Name]);
  

  // Ajouter une note
// Ajouter une note
const addNote = async () => {
    if (title && description) { // Vérification pour éviter d'ajouter des notes vides
      const newNote = { title, description, Name }; // Inclure userName dans la nouvelle note
      try {
        const response = await fetch('http://51.83.69.195:5000/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNote),
        });
        const savedNote = await response.json();
        setNotes([...notes, savedNote]);
        setTitle('');
        setDescription('');
      } catch (error) {
        console.error("Erreur lors de l'ajout de la note :", error);
      }
    }
  };
  

  // Supprimer une note
  const deleteNote = async (id) => {
    try {
      await fetch(`http://51.83.69.195:5000/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la note :", error);
    }
  };

  // Éditer une note
  const editNote = (index) => {
    const noteToEdit = notes[index];
    setTitle(noteToEdit.title);
    setDescription(noteToEdit.description);
    deleteNote(noteToEdit._id); // Supprime la note de la base de données et de l'affichage pour l'éditer
  };



  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-blue-gray-600 mb-4">Ajouter une note</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2 w-full mb-2  focus:outline-blue-gray-700"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2 w-full mb-2 focus:outline-blue-gray-700"
          rows="5"
        />
        
       

        

        <button onClick={addNote} className="bg-green-500 text-white px-4 py-2 rounded">Ajouter</button>
      </div>
      
      <h2 className="text-2xl font-bold text-blue-gray-600 mb-4 text-left">Vos notes</h2>
      <div className="grid grid-cols-1 gap-4">
        {notes.map((note, index) => (
          <div key={note._id} className="border rounded p-4">
            <h3 className="text-xl font-semibold text-blue-600">
               {note.title}
            </h3>
            <p>{note.description}</p>
            <div className="flex space-x-2 mt-2">
              <button onClick={() => deleteNote(note._id)} className="text-red-500">🗑️</button>
              <button onClick={() => editNote(index)} className="text-blue-500">✏️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlocNotes;
