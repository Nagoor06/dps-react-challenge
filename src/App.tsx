import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './components/UserTable';
import FilterControls from './components/FilterControls';
import PieChart from './components/PieChart';
import dpsLogo from './assets/DPS.svg';
import './App.css';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  highlight?: boolean;
}

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
        const usersWithCity = response.data.users.map((user: any) => ({
          ...user,
          city: user.address.city,
        }));
        setUsers(usersWithCity);
        setFilteredUsers(usersWithCity);
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

  // Pagination logic
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
      </div>
    </>
  );
};

export default App;
