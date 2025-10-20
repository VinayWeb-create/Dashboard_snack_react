import React, { useEffect, useState } from "react";

const UserDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user info from localStorage
    const storedUser = localStorage.getItem("vendorData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="userDetails p-6">
        <h2 className="text-xl font-semibold mb-3">User Details</h2>
        <p>No user information found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="userDetails p-6">
      <h2 className="text-xl font-semibold mb-3">User Details</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <p><strong>👤 Name:</strong> {user.name}</p>
        <p><strong>📧 Email:</strong> {user.email}</p>
        <p><strong>🏢 Firm ID:</strong> {user.firmId || "Not Selected"}</p>
        <p><strong>🕒 Logged In:</strong> {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default UserDetails;
