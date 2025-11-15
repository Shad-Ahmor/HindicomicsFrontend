import React, { useState } from 'react';
import EmployeeCard from './EmployeeCard';

const OrganizationTree = ({ data, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleCollapse = () => {
    setIsExpanded(!isExpanded);
  };

  if (!data) {
    return <p>Data not available</p>;
  }

  // Check if employees is an array or set it to an empty array by default
  const employees = Array.isArray(data.employees) ? data.employees : [];

  return (
    <div
      className="treeNode"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: level * 40 + 'px',
        position: 'relative',
      }}
    >
      <div className="cardHeader" onClick={toggleCollapse} >
        <EmployeeCard name={data.name} role={data.role} imageUrl={data.imageUrl} />
        <button className="toggleButton">{isExpanded ? '-' : '+'}</button>
      </div>

      {isExpanded && employees.length > 0 && (
        <div
          className="childrenContainer"
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            marginTop: '20px',
            position: 'relative',
          }}
        >
          <div className="verticalLine" />
          <div
            className="childNodes"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {employees.map((employee) => (
              <div key={employee.id} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <OrganizationTree data={employee} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default OrganizationTree;
