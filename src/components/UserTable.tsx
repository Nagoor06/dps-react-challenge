import React from 'react';
import '../App.css'; // Import the CSS file

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
          <th className="user-table-header">Id</th>
          <th className="user-table-header">Full Name</th>
          <th className="user-table-header">City</th>
          <th className="user-table-header">Birthday</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className={`user-table-row ${user.highlight ? 'highlight-row' : ''}`}>
            <td className="user-table-cell">{user.id}</td>
            <td className="user-table-cell">{user.firstName} {user.lastName}</td>
            <td className="user-table-cell">{user.city}</td>
            <td className="user-table-cell">{new Date(user.birthDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
