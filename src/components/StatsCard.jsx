import React, { useState } from 'react';

const StatsCard = ({ icon, bgColor, title, amount, percentage, percentageColor, onClick,isActive }) => {
//   const [isActive, setIsActive] = useState(isActive);

  const handleClick = () => {
    // setIsActive(!isActive); // Toggle the isActive state
    onClick(); // Call the onClick function passed from props
  };

  return (
    <div
      className={`relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md cursor-pointer ${
        isActive ? 'border-2 border-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div
        className={`bg-clip-border mx-4 rounded-xl overflow-hidden ${bgColor} text-white shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center`}
      >
        {icon}
      </div>
      <div className="p-4 text-right">
      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{amount}</h4>
        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">{title}</p>
      </div>
      <div className="border-t border-blue-gray-50 p-4">
        <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
          <strong className={percentageColor}>{percentage}</strong>&nbsp;
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
