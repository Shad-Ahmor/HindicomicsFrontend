import OrganizationTree from './OrganizationTree';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import React, { useEffect,useState } from 'react';

export default function CompanyHierarchy() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch organization data from the backend API
        const fetchOrganizationData = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('Token not found.');
              navigate('/login');  // Redirect to login if no token exists
              return;
            }    
            // Fetch organization data
            const response = await api.get('/users/organization', {
              headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the header
              },
            });
            setData(response.data); // Set organization data
          } catch (error) {
            console.error('Error fetching organization data:', error);
          }
        };
    
        fetchOrganizationData();
      }, []);
  return (
    <div>
      {!data || data.length === 0 ? <p>Loading...</p> :  <OrganizationTree data={data[0]} />}
      </div>
  )
}
