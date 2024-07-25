// src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './components/UserTable';
import FilterControls from './components/FilterControls';
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
  }, [debouncedNameFilter, cityFilter, highlightOldest, users]);

  return (
    <>
      <div>
        <a href="https://www.digitalproductschool.io/" target="_blank" rel="noopener noreferrer">
          <img src={dpsLogo} className="logo" alt="DPS logo" />
        </a>
      </div>
      <div className="home-card">
        <FilterControls
          nameFilter={nameFilter}
          onNameChange={(e) => setNameFilter(e.target.value)}
          cities={[...new Set(users.map(user => user.city))]}
          cityFilter={cityFilter}
          onCityChange={(e) => setCityFilter(e.target.value)}
          highlightOldest={highlightOldest}
          onHighlightChange={(e) => setHighlightOldest(e.target.checked)}
        />
        <UserTable users={filteredUsers} />
      </div>
    </>
  );
};

export default App;
