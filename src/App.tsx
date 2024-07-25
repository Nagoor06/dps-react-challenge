import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './components/UserTable';
import FilterControls from './components/FilterControls';
import PieChart from './components/PieChart';
import CityMap from './components/CityMap';
import dpsLogo from './assets/DPS.svg';
import './App.css';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  highlight?: boolean;
  lat: number;
  lng: number;
}

const cityCoordinates: { [key: string]: { lat: number, lng: number } } = {
  "Phoenix": { lat: 33.4484, lng: -112.0740 },
  "Houston": { lat: 29.7604, lng: -95.3698 },
  "Washington": { lat: 38.9072, lng: -77.0369 },
  "Seattle": { lat: 47.6062, lng: -122.3321 },
  "Jacksonville": { lat: 30.3322, lng: -81.6557 },
  "Fort Worth": { lat: 32.7555, lng: -97.3308 },
  "Indianapolis": { lat: 39.7684, lng: -86.1581 },
  "San Antonio": { lat: 29.4241, lng: -98.4936 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Denver": { lat: 39.7392, lng: -104.9903 },
  "Columbus": { lat: 39.9612, lng: -82.9988 },
  "San Jose": { lat: 37.3382, lng: -121.8863 },
  "San Diego": { lat: 32.7157, lng: -117.1611 },
  "Chicago": { lat: 41.8781, lng: -87.6298 },
  "Philadelphia": { lat: 39.9526, lng: -75.1652 },
  "Dallas": { lat: 32.7767, lng: -96.7970 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [highlightOldest, setHighlightOldest] = useState<boolean>(false);
  const [debouncedNameFilter, setDebouncedNameFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(10);

  useEffect(() => {
    axios.get('https://dummyjson.com/users')
      .then(response => {
        const usersWithCoordinates = response.data.users.map((user: any) => {
          const city = user.address.city;
          const coordinates = cityCoordinates[city];
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            city: city,
            lat: coordinates ? coordinates.lat : 0,
            lng: coordinates ? coordinates.lng : 0,
          };
        });
        setUsers(usersWithCoordinates);
        setFilteredUsers(usersWithCoordinates);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedNameFilter(nameFilter);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [nameFilter]);

  useEffect(() => {
    let filtered = users;

    if (debouncedNameFilter) {
      filtered = filtered.filter(user => {
        const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
        return fullName.includes(debouncedNameFilter.toLowerCase());
      });
    }

    if (cityFilter) {
      filtered = filtered.filter(user => user.city.toLowerCase().includes(cityFilter.toLowerCase()));
    }

    if (highlightOldest) {
      const oldestUsersByCity = new Map<string, User>();

      filtered.forEach(user => {
        const birthDate = new Date(user.birthDate);
        const currentOldest = oldestUsersByCity.get(user.city);
        if (!currentOldest || birthDate < new Date(currentOldest.birthDate)) {
          oldestUsersByCity.set(user.city, { ...user, birthDate });
        }
      });

      filtered = filtered.map(user => {
        const oldestUser = oldestUsersByCity.get(user.city);
        if (oldestUser && oldestUser.id === user.id) {
          return { ...user, highlight: true };
        }
        return { ...user, highlight: false };
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [debouncedNameFilter, cityFilter, highlightOldest, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="fixed-header">
        <div className="logo-filter-container">
          <a href="https://www.digitalproductschool.io/" target="_blank" rel="noopener noreferrer">
            <img src={dpsLogo} className="w-32 dps-logo" alt="DPS logo" />
          </a>
          <FilterControls
            nameFilter={nameFilter}
            onNameChange={(e) => setNameFilter(e.target.value)}
            cities={[...new Set(users.map(user => user.city))]}
            cityFilter={cityFilter}
            onCityChange={(e) => setCityFilter(e.target.value)}
            highlightOldest={highlightOldest}
            onHighlightChange={(e) => setHighlightOldest(e.target.checked)}
          />
        </div>
      </div>
      <div className="container mx-auto">
        <div className="main-content">
          <div className="table-container">
            <UserTable users={currentUsers} />
            <div className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="pie-chart-container">
            <div className="pie-chart-heading">User Distribution by City</div>
            <PieChart users={filteredUsers} />
          </div>
        </div>
        <div className="map-container mt-6">
          <h2 className="text-xl font-semibold mb-4">Users Location</h2>
          <CityMap users={filteredUsers} />
        </div>
      </div>
    </>
  );
};

export default App;
