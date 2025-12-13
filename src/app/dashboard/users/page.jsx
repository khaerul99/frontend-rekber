"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search, Trash2, ShieldCheck, ShieldAlert, UserCog } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data Users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
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
        const result = users.filter(user => 
            user.username.toLowerCase().includes(lowerSearch) ||
            user.email.toLowerCase().includes(lowerSearch)
        );
        setFilteredUsers(result);
    }
  }, [search, users]);

  // 3. Handle Delete User
  const handleDelete = async (id) => {
    try {
        await api.delete(`/users/${id}`);
        toast.success("User berhasil dihapus");
        fetchUsers(); // Refresh table
    } catch (error) {
        toast.error(error.response?.data?.message || "Gagal menghapus user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Kelola User</h1>
            <p className="text-slate-500">Total Member: {users.length}</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Cari nama atau email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <Card>
        <CardContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status 2FA</TableHead>
                        <TableHead>Tanggal Join</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">Memuat data...</TableCell>
                        </TableRow>
                    ) : filteredUsers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-slate-500">User tidak ditemukan.</TableCell>
                        </TableRow>
                    ) : (
                        filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.username}</span>
                                            <span className="text-xs text-slate-500">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.role === 'ADMIN' ? (
                                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
                                            ADMIN
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-slate-600">
                                            MEMBER
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {user.twofa_enabled ? (
                                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                            <ShieldCheck size={14} /> Aktif
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                                            <ShieldAlert size={14} /> Non-Aktif
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">
                                    {format(new Date(user.createdAt), "dd MMM yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 size={18} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus User ini?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tindakan ini tidak dapat dibatalkan. User <strong>{user.username}</strong> akan dihapus permanen.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700">
                                                    Ya, Hapus
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}