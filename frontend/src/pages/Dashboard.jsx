import React, { useState } from "react";
import {
  useGetCryptosQuery,
  useAddCryptoMutation,
  useUpdateCryptoMutation,
  useDeleteCryptoMutation,
} from "../services/cryptoApi";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [formData, setFormData] = useState({ name: "", rate: "" });
  const [selectedCryptoId, setSelectedCryptoId] = useState(null); // Track selected crypto for update
  const { data: cryptos, isLoading } = useGetCryptosQuery();
  const [addCrypto] = useAddCryptoMutation();
  const [updateCrypto] = useUpdateCryptoMutation();
  const [deleteCrypto] = useDeleteCryptoMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.rate) {
      await addCrypto(formData);
      setFormData({ name: "", rate: "" });
    }
  };

  const handleUpdate = async () => {
    if (selectedCryptoId && formData.name && formData.rate) {
      await updateCrypto({ id: selectedCryptoId, ...formData });
      setFormData({ name: "", rate: "" }); // Clear form after update
      setSelectedCryptoId(null); // Reset selected crypto
    }
  };

  const handleDelete = async (cryptoId) => {
    await deleteCrypto(cryptoId);
  };

  const handleEdit = (crypto) => {
    setFormData({ name: crypto.name, rate: crypto.rate });
    setSelectedCryptoId(crypto._id); // Set the selected crypto ID
  };

  if (isLoading)
    return (
      <div>
        {" "}
        <Loader />{" "}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-gray-600 text-white p-6 rounded-lg mb-8 shadow-lg">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-lg mt-2">Manage your crypto assets with ease</p>
      </div>

      {/* Add Crypto Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Crypto</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Crypto Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Rate"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-green-500 to-gray-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Add Crypto
            </button>
            {selectedCryptoId && (
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Update Crypto
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Crypto List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptos?.map((crypto) => (
          <div
            key={crypto._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-800">{crypto.name}</h3>
            <p className="text-gray-600 mt-2">Rate: ${crypto.rate}</p>
            <div className="mt-4 flex space-x-2">
              {/* Edit Button */}
              <button
                onClick={() => handleEdit(crypto)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(crypto._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
