import React, { useState, useEffect } from "react";
import axios from 'axios';
import * as XLSX from "xlsx";
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Button, IconButton, Select, MenuItem } from "@mui/material";
import Textarea from '@mui/joy/Textarea';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Pagination } from "@mui/material";
import { FaFileAlt } from "react-icons/fa";
import { GiOpenFolder } from "react-icons/gi";
import { IoMdReturnLeft } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { MdClose } from "react-icons/md";

const FileImport = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [files, setFiles] = useState([]);
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(""); 
  const limit = 100;

  const navigate = useNavigate();


// Récupérer la liste des utilisateurs
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://51.83.69.195:5000/api/users');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      const data = await response.json();

          // Filtrer les utilisateurs ayant le rôle "Commerciale" ou "Manager"
          const filteredUsers = data.filter(user => 
            user.role === 'Commerciale' || user.role === 'Manager'
          );
      setUsers(filteredUsers);
      
    } catch (error) {
      console.error(error);
    }
  };

  fetchUsers();
}, []);



const fetchFiles = async () => {
  try {

    let url = `http://51.83.69.195:5000/api/import/files?userRole=${userRole}&userName=${userName}`;


    const response = await fetch(url);
    const result = await response.json();

    setFiles(result);
  } catch (error) {
    console.error("❌ Erreur lors du chargement des fichiers", error);
  }
};

// Charger les fichiers dès que `userName` et `userRole` sont disponibles
useEffect(() => {
  if (userName && userRole) {
    fetchFiles();
  }
}, [userName, userRole]);





  const handleFileUpload = async () => {
  
    const fileInput = document.getElementById("fileInput");
    if (!fileInput || !fileInput.files.length) {
      alert("Veuillez sélectionner un fichier");
      return;
    }
  
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", selectedUser || ""); // Si aucun utilisateur, fichier public
  
    try {
      const response = await fetch("http://51.83.69.195:5000/api/import/upload", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {

        fetchFiles(); // Mise à jour des fichiers après importation
      } else {
        console.error("Erreur lors de l'importation du fichier");
      }
    } catch (error) {
      console.error("Erreur lors de l'importation du fichier:", error);
    }
  };
  
  
  const handleViewFile = async (fileId, page = 1) => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/import/file/${fileId}?page=${page}&limit=${limit}`);
      const result = await response.json();
      
      setData(result.data);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setSelectedFile(fileId);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier", error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/import/file/${fileId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier", error);
    }
  };

  const handleReturn = () => {
    setSelectedFile(null);
  };

  const handleChangePage = (event, newPage) => {
    handleViewFile(selectedFile, newPage);
  };

  const handleStatusChange = (rowIndex, event) => {
    setStatusMap(prev => ({ ...prev, [rowIndex]: event.target.value || "" }));
  };
  
  const handleCommentChange = (rowIndex, event) => {
    setCommentMap(prev => ({ ...prev, [rowIndex]: event.target.value || "" }));
  };
  
  

  const handleSaveModification = async (rowIndex) => {
    try {
      const response = await fetch(`http://51.83.69.195:5000/api/import/file/${selectedFile}/modify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rowIndex,
          status: statusMap[rowIndex] || "",
          comment: commentMap[rowIndex] || "",
          commercialName: userName,
        }),
      });
      if (response.ok) {
        handleViewFile(selectedFile, currentPage); // Recharger les données
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la modification", error);
    }
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
          setUserName(response.data.user.name);
          setUserRole(response.data.user.role);
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

  return (
    <div>
      <div className="flex flex-col items-start space-y-4 p-4 bg-white shadow-md rounded-lg w-full max-w-md">
      {userRole === "Direction" && (
  <div className="flex items-center space-x-4">
    <input 
      id="fileInput"
      type="file" 
      accept=".xlsx, .xls" 
      className="border p-2 rounded-lg cursor-pointer"
    />
    <Select 
      value={selectedUser} 
      onChange={(e) => setSelectedUser(e.target.value)}
      displayEmpty
    >
      <MenuItem value="">Tous les utilisateurs</MenuItem>
      {users.map((user) => (
        <MenuItem key={user._id} value={user.name}>
          {user.name}
        </MenuItem>
      ))}
    </Select>
    <Button onClick={handleFileUpload} variant="contained" color="primary">
      Importer
    </Button>
  </div>
)}


        <h3 className="text-lg font-semibold">📂 Fichiers enregistrés </h3>
        <ul className="w-full space-y-2">
          {files.map((file) => (


            <li 
              key={file._id} 
              className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-2">
                <FaFileAlt className="text-blue-500" />
                <span className="text-gray-900">{file.filename}</span>
              </div>
              <div className="flex items-center space-x-2">
                <IconButton onClick={() => handleViewFile(file._id)}>
                  <GiOpenFolder className="text-yellow-700 hover:text-yellow-900" />
                </IconButton>
                {userRole === "Direction" && (
                <IconButton onClick={() => handleDeleteFile(file._id)}>
                  <RiDeleteBin6Line className="text-red-500 hover:text-red-700" />
                </IconButton>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedFile && (
        <>
          <div className="flex justify-start mt-4">
            <IconButton onClick={handleReturn} >
              <MdClose  className="text-red-700 hover:text-white  hover:bg-red-700 "  />
            </IconButton>
          </div>
          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
            <TableHead>
            <TableRow className="bg-blue-gray-500 text-white"> 
    <TableCell style={{ color: 'white' }}>#</TableCell>
    {data[0] && Object.keys(data[0]).map((col, index) => (
      <TableCell key={index} style={{ color: 'white' }}>{col}</TableCell>
    ))}
    {userRole === "Commerciale" && userRole === "Manager" && (
      <>
        <TableCell style={{ color: 'white' }}>Statut</TableCell>
        <TableCell style={{ color: 'white' }}>Commentaire</TableCell>
        <TableCell style={{ color: 'white' }}>Action</TableCell>
      </>
    )}
    {userRole === "Direction" && (
      <>
        <TableCell style={{ color: 'white' }}>Modifications</TableCell>
      </>
    )}
  </TableRow>
</TableHead>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{(currentPage - 1) * limit + rowIndex + 1}</TableCell>
                    {Object.keys(row).map((col, colIndex) => (
                      <TableCell key={colIndex}>{row[col]}</TableCell>
                    ))}
                    {(userRole === "Commerciale" || userRole === "Manager") && (
                      <>
                        <TableCell>
                        <Select 
                       value={statusMap[rowIndex] || ""} 
                       onChange={(event) => handleStatusChange(rowIndex, event)}
                        >
                          <MenuItem value=""></MenuItem>
                       <MenuItem value="Signature">Signature</MenuItem>
                      <MenuItem value="RDV">RDV</MenuItem>
                       <MenuItem value="Rappel">Rappel</MenuItem>
                       <MenuItem value="NRP">NRP</MenuItem>
                       <MenuItem value="Refus catégorique">Refus catégorique</MenuItem>
                       </Select>

                        </TableCell>
                        <TableCell>
                        <Textarea
                        color="neutral"
                        minRows={2}
                        size="md"
                        variant="outlined"
                        value={commentMap[rowIndex] || ""} 
                        onChange={(event) => handleCommentChange(rowIndex, event)}
                        placeholder="Commentaire…"
                        />
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleSaveModification(rowIndex)}>Enregistrer</Button>
                        </TableCell>
                      </>
                    )}
                       <TableCell>
                       {files.find(f => f._id === selectedFile)?.modifications
                       ?.filter(mod => mod.rowIndex === rowIndex && (userRole === "Direction" || mod.commercialName === userName))
                       .map((mod, index) => (
                       <div key={index}>
                       <strong>{mod.commercialName}</strong> <br />
                       <span 
                        style={{
                         color: mod.status === "Signature" ? "green" 
                              : mod.status === "Refus catégorique" ? "red" 
                              : mod.status === "NRP" ? "orange"
                              : mod.status === "RDV" ? "blue" 
                              : mod.status === "Rappel" ? "indigo"
                              : "gray"
                        }}
                       >
                      {mod.status} <br />
                       </span>  {mod.comment} <br />
                       <span className="mr-1" >Le</span>
                       <span className="text-blue-700">
                         {new Date(mod.modifiedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} 
                         <span className="mx-1 text-black" >à</span>
                         {new Date(mod.modifiedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                         </span>
                     </div>
                    ))}
                  </TableCell>

                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FileImport;