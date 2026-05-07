"use client"
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataTable from "@/components/Tables/DataTable";
import React, { useMemo } from 'react';
import { useUsers } from "@/hooks/useUsers";

interface UserRow {
  name: string;
  email: string;
  mobile_number: string;
  issubscribed: string;
  role: string;
  portfolio_link: string;
  createdon: string;
  inactive: string;
}

const UserManagement = () => {

  const headers = ["Name", "Email", "Mobile Number", "IsSubscribed", "Role", "Portfolio Link", "CreatedOn", "Inactive"];
  const filterOptions = {
    issubscribed: ["Yes", "No"],
    inactive: ["Yes", "No"],
  };
  const { users, error, isLoading } = useUsers();
  const formattedUsers = useMemo<UserRow[]>(
    () =>
      users.map((user) => ({
        name: user.name || "N/A",
        email: user.email || "N/A",
        mobile_number: user.mobileNumber || "N/A",
        issubscribed: user.isSubscribed ? "Yes" : "No",
        role: user.role || "N/A",
        portfolio_link: "N/A",
        createdon: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
        inactive: user.isActive === false ? "Yes" : "No",
      })),
    [users],
  );

  return (
    <DefaultLayout>
      <h1 className="text-3xl font-bold mb-5">User Management</h1>
      {error && (
        <div className="mb-4 rounded-md border border-red bg-red/10 px-4 py-3 text-sm text-red">
          {error}
        </div>
      )}
      {isLoading && <p className="mb-4 text-sm">Loading users...</p>}
      <DataTable headers={headers} data={formattedUsers} filterOptions={filterOptions} />
    </DefaultLayout>
  );
};

export default UserManagement;
