import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserSection() {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({ username: "", email: "", image: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        axios.get("/users")
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    };

    const deleteUser = (id) => {
        axios.delete(`/users/${id}`)
            .then(() => {
                setUsers(users.filter(user => user.id !== id));
            })
            .catch((error) => console.error("Error deleting user:", error));
    };

    const startEdit = (user) => {
        setEditUserId(user.id);
        setEditFormData({ username: user.username, email: user.email, image: null });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB.");
            return;
        }
        setEditFormData({ ...editFormData, image: file });
    };

    const updateUser = (id) => {
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("username", editFormData.username);
        formData.append("email", editFormData.email);
        if (editFormData.image) {
            formData.append("image", editFormData.image);
        }

        axios.post(`/users/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json"
            }
        })
            .then((response) => {
                setUsers(users.map(user => user.id === id ? response.data.user : user));
                setEditUserId(null);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            });
    };

    return (
        <>
        <div>
            <h2 className="text-2xl font-bold mb-4">User Section</h2>
            {loading ? (
                <p className="text-center">Loading users...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Sr. No</th>
                            <th className="border p-2">Profile</th>
                            <th className="border p-2">Username</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map((user, index) => (
                            <tr key={user.id} className="text-center">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">
                                    {editUserId === user.id ? (
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="border p-1 w-full" />
                                    ) : user.image ? (
                                        <img src={user.image} alt="User" className="w-16 h-16 rounded-full object-cover mx-auto" />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td className="border p-2">
                                    {editUserId === user.id ? (
                                        <input type="text" name="username" value={editFormData.username} onChange={handleEditChange} className="border p-1 w-full" />
                                    ) : (
                                        user.username
                                    )}
                                </td>
                                <td className="border p-2">
                                    {editUserId === user.id ? (
                                        <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} className="border p-1 w-full" />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="border p-2 space-x-2">
                                    {editUserId === user.id ? (
                                        <button onClick={() => updateUser(user.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                                    ) : (
                                        <button onClick={() => startEdit(user)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                                    )}
                                    <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4">No Users Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
        </>
    );
}
