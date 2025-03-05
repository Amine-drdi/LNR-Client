import { useState } from 'react';

const Formation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formation, setFormation] = useState([]);
  
  const options = [
    "Transformation numérique",
    "échafaudage fixe",
    "Habilitations Électriques B0",
    "La cybersécurité",
    "développement durable",
    "Autocad",
    "CACES R482",
    "CACES R486",
    "CACES R489",
    "Echafaudage roulant",
    "Habilitations électriques",
    "Revit",
    "RGE",
    "Sketchup",
    "SST initial",
    "Travail en hauteur"
  ];

  const handleCheckboxChange = (value) => {
    if (formation.includes(value)) {
      setFormation(formation.filter(option => option !== value));
    } else {
      setFormation([...formation, value]);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="border border-blue-gray-300 rounded-md p-2 w-full text-left focus:ring-blue-gray-500 focus:border-blue-gray-500"
      >
        Sélectionner des formations
      </button>
      {isOpen && (
        <div className="absolute bg-white border border-blue-gray-300 rounded-md mt-1 w-full z-10">
          {options.map(option => (
            <label key={option} className="flex items-center p-2">
              <input
                type="checkbox"
                value={option}
                checked={formation.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Formation;
