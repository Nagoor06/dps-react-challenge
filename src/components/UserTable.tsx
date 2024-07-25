// src/components/UserTable.tsx
import React from 'react';

interface UserTableProps {
  users: Array<{
    id: number;
    firstName: string;
    lastName: string;
    city: string;
    birthDate: string;
    highlight?: boolean;
  }>;
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Full Name</th>
          <th>City</th>
          <th>Birthday</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className={user.highlight ? 'highlight' : ''}>
            <td>{user.id}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.city}</td>
            <td>{new Date(user.birthDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
