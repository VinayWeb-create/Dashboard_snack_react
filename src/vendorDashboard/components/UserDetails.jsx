import React, { useEffect, useState } from "react";
import { API_URL } from "../data/apiPath"; // your API URL

const UserDetails = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    const vendorId = localStorage.getItem("vendorId");

    if (!token || !vendorId) {
      setError("No user information found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchVendor = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // if your backend checks token
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setVendor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, []);

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="userDetailsSection">
      <h3>User Details</h3>
      <p><strong>Username:</strong> {vendor.username}</p>
      <p><strong>Email:</strong> {vendor.email}</p>
      <p><strong>Firm:</strong> {vendor.primaryFirm?.firmName || "No firm assigned"}</p>

      {vendor.primaryFirm?.products?.length > 0 ? (
        <>
          <h4>Products:</h4>
          <ul>
            {vendor.primaryFirm.products.map((prod) => (
              <li key={prod._id}>
                {prod.productName} - ${prod.price}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No products added yet.</p>
      )}
    </div>
  );
};

export default UserDetails;
