"use client"
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DataTable from "@/components/Tables/DataTable";


const UserManagement = () => {
  const users = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      mobile_number: "123-456-7890",
      issubscribed: "Yes",
      portfolio_id: "123",
      portfolio_link: "/portfolio/123",
      createdon: "2023-10-26",
      inactive: "No",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      mobile_number: "987-654-3210",
      issubscribed: "No",
      portfolio_id: "456",
      portfolio_link: "/portfolio/456",
      createdon: "2023-10-25",
      inactive: "Yes",
    },
    {
      name: "David Lee",
      email: "david.lee@example.com",
      mobile_number: "555-123-4567",
      issubscribed: "Yes",
      portfolio_id: "789",
      portfolio_link: "/portfolio/789",
      createdon: "2023-10-24",
      inactive: "No",
    },
    {
      name: "Sarah Jones",
      email: "sarah.jones@example.com",
      mobile_number: "111-222-3333",
      issubscribed: "No",
      portfolio_id: "101",
      portfolio_link: "/portfolio/101",
      createdon: "2023-10-23",
      inactive: "No",
    },
    {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      mobile_number: "444-555-6666",
      issubscribed: "Yes",
      portfolio_id: "202",
      portfolio_link: "/portfolio/202",
      createdon: "2023-10-22",
      inactive: "Yes",
    },
    {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      mobile_number: "777-888-9999",
      issubscribed: "No",
      portfolio_id: "303",
      portfolio_link: "/portfolio/303",
      createdon: "2023-10-21",
      inactive: "No",
    },
    {
      name: "Kevin Wilson",
      email: "kevin.wilson@example.com",
      mobile_number: "333-444-5555",
      issubscribed: "Yes",
      portfolio_id: "404",
      portfolio_link: "/portfolio/404",
      createdon: "2023-10-20",
      inactive: "No",
    },
    {
      name: "Jessica Garcia",
      email: "jessica.garcia@example.com",
      mobile_number: "666-777-8888",
      issubscribed: "No",
      portfolio_id: "505",
      portfolio_link: "/portfolio/505",
      createdon: "2023-10-19",
      inactive: "Yes",
    },
    {
      name: "Brian Rodriguez",
      email: "brian.rodriguez@example.com",
      mobile_number: "888-999-0000",
      issubscribed: "Yes",
      portfolio_id: "606",
      portfolio_link: "/portfolio/606",
      createdon: "2023-10-18",
      inactive: "No",
    },
    {
      name: "Ashley Martinez",
      email: "ashley.martinez@example.com",
      mobile_number: "222-333-4444",
      issubscribed: "No",
      portfolio_id: "707",
      portfolio_link: "/portfolio/707",
      createdon: "2023-10-17",
      inactive: "No",
    },
  ];
  const headers = ["Name", "Email", "Mobile Number", "IsSubscribed", "Portfolio ID", "Portfolio Link", "CreatedOn", "Inactive"];
  const filterOptions = {
    issubscribed: ["Yes", "No"],
    inactive: ["Yes", "No"],
  };
  return (
    <DefaultLayout>
      <h1 className="text-3xl font-bold mb-5">User Management</h1>
      <DataTable headers={headers} data={users} filterOptions={filterOptions} />
    </DefaultLayout>
  );
};

export default UserManagement;
