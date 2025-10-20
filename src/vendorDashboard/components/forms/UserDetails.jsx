import React, { useEffect, useState } from "react";

const UserDetails = () => {
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    // Fetch vendor details from backend using token
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      window.location.href = "/login";
      return;
    }

    const fetchVendorDetails = async () => {
      try {
        const res = await fetch("https://backend-nodejs-suby-2-rts0.onrender.com/vendor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await res.json();
        setVendor(data.vendor);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVendorDetails();
  }, []);

  if (!vendor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <h2 className="text-xl font-semibold">Loading user details...</h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md border border-cyan-400">
        <h1 className="text-2xl font-bold text-cyan-300 mb-4 text-center">
          👤 Vendor Profile
        </h1>
        <div className="space-y-3">
          <div>
            <span className="text-gray-400">Name:</span>
            <p className="text-lg font-medium">{vendor.name}</p>
          </div>
          <div>
            <span className="text-gray-400">Email:</span>
            <p className="text-lg font-medium">{vendor.email}</p>
          </div>
          <div>
            <span className="text-gray-400">Firm Name:</span>
            <p className="text-lg font-medium">{vendor.firmName || "—"}</p>
          </div>
          <div>
            <span className="text-gray-400">Vendor ID:</span>
            <p className="text-lg font-mono">{vendor._id}</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            alert("Logged out successfully");
            window.location.href = "/login";
          }}
          className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 rounded-xl transition-all"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
