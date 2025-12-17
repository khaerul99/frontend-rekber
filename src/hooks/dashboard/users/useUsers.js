"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { userService } from "@/services/users/userServices";
import { adminService } from "@/services/admin/adminServices";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data Users
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

  // 2. Search Logic
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

  // 3. Handle Delete User
  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      toast.success("User berhasil dihapus");
      fetchUsers(); // Refresh table
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    }
  };
  return { users, filteredUsers, search, setSearch, loading, handleDelete };
}
