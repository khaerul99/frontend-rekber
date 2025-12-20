"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminService } from "@/services/admin/adminServices";
import { userService } from "@/services/users/userServices";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch Data Users
  const fetchUsers = async () => {
    try {
      const dataUser = await adminService.getAllUsers();
      setUsers(dataUser);
      setFilteredUsers(dataUser);
    } catch (error) {
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search Logic
  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      const lowerSearch = search.toLowerCase();
      const result = users.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerSearch) ||
          user.email.toLowerCase().includes(lowerSearch)
      );
      setFilteredUsers(result);
    }
  }, [search, users]);

  //  Handle Delete User
  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      toast.success("User berhasil dihapus");
      fetchUsers(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    }
  };

  const handleViewDetail = async (row) => {
    setIsModalOpen(true); 
    setSelectedUser(row); 

    try {
      const freshUser = await userService.getUserById(row.id);
      setSelectedUser(freshUser);
    } catch (error) {
      console.error("Gagal ambil detail user", error);
    }
  };

  const cloceModal = () => {
    setIsModalOpen(false)
  }

  return { users, filteredUsers, search, setSearch, loading, handleDelete, handleViewDetail, isModalOpen, cloceModal, setIsModalOpen, selectedUser };
}
