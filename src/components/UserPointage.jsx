import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PiFingerprint } from "react-icons/pi";
const UserPointage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointages, setPointages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://51.83.69.195:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch pointages for the selected user
  const fetchPointages = async (matricule) => {
    try {
      const response = await axios.get(`http://51.83.69.195:5000/api/pointage/pointage/${matricule}`);
      setPointages(response.data);
    } catch (error) {
      console.error('Error fetching pointages:', error);
    }
  };

  // Handle user selection
  const handleUserSelect = (selectedOption) => {
    setSelectedUser(selectedOption);
    if (selectedOption) {
      fetchPointages(selectedOption.value);
    } else {
      setPointages([]);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter pointages by date range
  const filteredPointages = pointages.filter((pointage) => {
    const pointageDate = new Date(pointage.timestamp);
    return (
      (!startDate || pointageDate >= startDate) &&
      (!endDate || pointageDate <= endDate)
    );
  });

  // Group pointages by date
  const groupPointagesByDate = () => {
    const grouped = {};
    filteredPointages.forEach((pointage) => {
      const date = new Date(pointage.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(pointage);
    });
    return grouped;
  };

  const groupedPointages = groupPointagesByDate();

  return (
    <div className="p-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-4">
        
            <Select
              options={filteredUsers.map((user) => ({
                value: user.matricule,
                label: user.name,
              }))}
              onInputChange={(value) => setSearchTerm(value)}
              onChange={handleUserSelect}
              placeholder="Rechercher un utilisateur..."
              isClearable
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Filtrer par date</label>
            <div className="flex space-x-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Date de début"
                className="p-2 border rounded"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Date de fin"
                className="p-2 border rounded"
              />
            </div>
          </div>
        </div>
        <div>
          {selectedUser && (
            <div>
              <h2 className="text-xl font-bold mb-2 text-blue-700 flex items-center gap-2 pl-32">Pointages de {selectedUser.label} <PiFingerprint /></h2>
              {Object.entries(groupedPointages).map(([date, pointages]) => (
                <div key={date} className="mb-4">
                  <h3 className="font-semibold text-green-500">{date}</h3>
                  <ul className="space-y-1">
                    {pointages.map((pointage, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{pointage.type}</span>
                        <span>{new Date(pointage.timestamp).toLocaleTimeString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPointage;