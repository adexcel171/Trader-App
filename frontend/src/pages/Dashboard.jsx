import React, { useState } from "react";
import {
  useGetCryptosQuery,
  useAddCryptoMutation,
  useUpdateCryptoMutation,
  useDeleteCryptoMutation,
} from "../services/cryptoApi";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [formData, setFormData] = useState({ name: "", rate: "" });
  const { data: cryptos, isLoading } = useGetCryptosQuery();
  const [addCrypto] = useAddCryptoMutation();
  const [updateCrypto] = useUpdateCryptoMutation();
  const [deleteCrypto] = useDeleteCryptoMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.rate) {
      try {
        await addCrypto(formData).unwrap();
        setFormData({ name: "", rate: "" });
        toast.success("Crypto added successfully!");
      } catch (error) {
        toast.error("Failed to add crypto.");
      }
    }
  };

  const handleUpdate = async (cryptoId, updatedData) => {
    if (cryptoId && updatedData.name && updatedData.rate) {
      try {
        await updateCrypto({ id: cryptoId, ...updatedData }).unwrap();
        toast.success("Crypto updated successfully!");
      } catch (error) {
        toast.error("Failed to update crypto.");
      }
    }
  };

  const handleDelete = async (cryptoId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCrypto(cryptoId).unwrap();
        toast.success("Crypto deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete crypto.");
      }
    }
  };

  const handleEdit = (crypto) => {
    Swal.fire({
      title: "Edit Crypto",
      html: `
        <input id="swal-input1" class="swal2-input" value="${crypto.name}" placeholder="Crypto Name">
        <input id="swal-input2" class="swal2-input" value="${crypto.rate}" placeholder="Rate">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        return {
          name: document.getElementById("swal-input1").value,
          rate: document.getElementById("swal-input2").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = result.value;
        handleUpdate(crypto._id, updatedData); // Pass the updated data directly
      }
    });
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-gradient-to-r text-center from-green-500 to-gray-600 text-white p-6 rounded-lg mb-8 shadow-lg">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-lg mt-2">Manage your crypto assets with ease</p>
      </div>

      {/* Add Crypto Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white md:flex flex-col justify-between items-center space-x-2 p-6 rounded-xl shadow-md mb-8"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Add New Crypto</h2>
        <div className="space-y-4 ">
          <input
            type="text"
            placeholder="Crypto Name"
            className="w-full p-3 border  md:w-[500px] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Rate"
            className="w-full p-3 border md:w-[500px] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.rate}
            onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
          />
          <button
            type="submit"
            className="w-full p-3 md:w-[500px] bg-gradient-to-r from-green-500 to-gray-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Add Crypto
          </button>
        </div>
      </form>

      {/* Crypto List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptos?.map((crypto) => (
          <div
            key={crypto._id}
            className="bg-white flex flex-col justify-center items-center p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
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
