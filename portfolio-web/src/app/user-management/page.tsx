"use client"
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataTable from "@/components/Tables/DataTable";
import React, { useEffect, useState } from 'react';
import * as ApiCall from "@/helper/apiRequest";
import { useAuth } from "../auth/AuthContext";
interface User {
  name: string;
  email: string;
  mobile_number?: string;
  issubscribed?: string;
  role?: string;
  portfolio_link?: string;
  createdAt?: string| Date | any;
  inactive?: string;
  // Add other properties as needed
}
const UserManagement = () => {

  const headers = ["Name", "Email", "Mobile Number", "IsSubscribed", "Role", "Portfolio Link", "CreatedOn", "Inactive"];
  const filterOptions = {
    issubscribed: ["Yes", "No"],
    inactive: ["Yes", "No"],
  };
  const [users, setUsers] = useState<User[]>([]);
  const { user }: any = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await ApiCall.get("users", { token: user.token });
      const formattedUsers = response.map((user: User) => {
        return {
          name: user.name || "N/A",
          email: user.email || "N/A",
          mobile_number: user.mobile_number || "N/A",
          issubscribed: user.issubscribed || "N/A",
          role: user.role || "N/A",
          portfolio_link: user.portfolio_link || "N/A",
          createdon: new Date(user.createdAt).toLocaleDateString() || "N/A",
          inactive: user.inactive || "N/A",
        };
      });
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <DefaultLayout>
      <h1 className="text-3xl font-bold mb-5">User Management</h1>
      <DataTable headers={headers} data={users} filterOptions={filterOptions} />
    </DefaultLayout>
  );
};

export default UserManagement;
