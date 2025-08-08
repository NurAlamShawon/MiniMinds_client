import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const MakeAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // Search when searchTrigger updates
  const {
    data: userResults = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userSearch", searchTrigger],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/users/search?email=${searchTrigger}`
      );
      return Array.isArray(res.data) ? res.data : [res.data];
    },
    enabled: !!searchTrigger, // query only runs when trigger has value
    staleTime: 0,
    keepPreviousData: false,
  });

  // Watch input changes
  useEffect(() => {
    if (searchTerm.trim()) {
      setSearchTrigger(searchTerm.trim());
    } else {
      // Clear results if input is empty
      queryClient.setQueryData(["userSearch", searchTrigger], []);
    }
  }, [searchTerm, queryClient]);

  // Role mutation (for put or patch)
  const mutation = useMutation({
    mutationFn: ({ userId, makeAdmin }) =>
      axiosInstance.put(
        `/users/${userId}/${makeAdmin ? "make-admin" : "remove-admin"}`
      ),
    onSuccess: (_, { userId, makeAdmin }) => {
      queryClient.setQueryData(["userSearch", searchTrigger], (old) =>
        old?.map((user) =>
          user._id === userId
            ? { ...user, role: makeAdmin ? "admin" : "user" }
            : user
        )
      );

      Swal.fire({
        icon: "success",
        title: makeAdmin ? "Admin Added!" : "Admin Removed!",
        text: makeAdmin
          ? "This user has been promoted to admin."
          : "This user is no longer an admin.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      console.error("Error updating role:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.error || "Something went wrong!",
      });
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Control Panel</h2>

      <div className="flex gap-2 mb-4">
        <div className="flex items-center border rounded p-2 w-full bg-white">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter user email"
            className="outline-none w-full"
          />
        </div>
      </div>

      {isError && (
        <p className="text-red-500 mb-4">
          {error?.response?.status === 404
            ? "User not found"
            : "Something went wrong"}
        </p>
      )}

      {searchTerm && userResults.length > 0 && (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {userResults.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border capitalize">{user.role}</td>
                <td className="p-2 border">
                  {user.role === "admin" ? (
                    <button
                      onClick={() =>
                        mutation.mutate({ userId: user._id, makeAdmin: false })
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        mutation.mutate({ userId: user._id, makeAdmin: true })
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {searchTerm && !isLoading && userResults.length === 0 && !isError && (
        <p className="text-gray-500">No user found for that email.</p>
      )}
    </div>
  );
};

export default MakeAdmin;
