import React from 'react';

const EmployeeCard = ({ name, role, imageUrl }) => {
  return (
    <div className="card">
      <div className="imageContainer">
        <img src={imageUrl} alt={name} className="image" />
      </div>
      <div className="cardContent">
        <h3 className="name">{name}</h3>
        <p className="role">{role}</p>
      </div>
    </div>
  );
};

export default EmployeeCard;
