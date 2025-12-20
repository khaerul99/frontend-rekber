"use client";

import { format } from "date-fns";
import {
  Search,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Eye,
  User,
  CreditCard,
  Calendar,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUsers } from "@/hooks/dashboard/users/useUsers";
import AdminGuard from "@/components/adminGuard/AdminGuard";
import DataTable from "react-data-table-component";

export default function UserManagementPage() {
  const {
    users,
    filteredUsers,
    search,
    setSearch,
    loading,
    handleDelete,
    handleViewDetail,
    isModalOpen,
    setIsModalOpen,
    cloceModal,
    selectedUser,
  } = useUsers();

  const columns = [
    {
      name: "User",
      selector: (row) => row.username,
      sortable: true, // Fitur sort otomatis aktif
      width: "180px",
    },
    {
      name: "role",
      selector: (row) => row.role,
      cell: (row) => (
        <Badge
          variant="outline"
          className={
            row.role === "ADMIN"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }
        >
          {row.role}
        </Badge>
      ),
      width: "200px",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      cell: (row) => (
        <div className="flex items-center gap-1text-xs font-medium">
          {row.email}
        </div>
      ),
    },
    {
      name: "Tanggal Join",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (row) => format(new Date(row.createdAt), "dd MMM yyyy HH:mm"),
      width: "150px",
    },
    {
      name: "Aksi",
      selector: (row) => row.id,
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => handleViewDetail(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus User ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. User{" "}
                  <strong>{row.username}</strong> akan dihapus permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(row.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      style: { display: "flex", justifyContent: "center" },
      ignoreRowClick: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        backgroundColor: "#f8fafc", // slate-50
      },
    },
    rows: {
      style: {
        minHeight: "60px", // override the row height
      },
    },
  };

  return (
    <AdminGuard>
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
            <DataTable
              columns={columns}
              data={filteredUsers}
              customStyles={customStyles}
              pagination
              progressPending={loading}
              progressComponent={
                <div className="p-10">
                  <Loader2 className="animate-spin" />
                </div>
              }
              highlightOnHover
              pointerOnHover
              noDataComponent={
                <div className="p-10 text-slate-500">Tidak ada data user.</div>
              }
            />
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Profil Pengguna</DialogTitle>
              <DialogDescription>
                Detail informasi akun member.
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-6 py-4">
                {/* Header: Foto & Nama */}
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-sm">
                    <AvatarFallback className="text-2xl bg-slate-100">
                      {selectedUser.username?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedUser.username}
                    </h3>
                    {selectedUser?.twofa_enabled ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        2FA Aktif
                      </Badge>
                    ) : (
                      <Badge variant="destructive">2FA Non-Aktif</Badge>
                    )}
                  </div>
                  <Badge className="mt-1">{selectedUser.role}</Badge>
                </div>

                <Separator />

                {/* Informasi Detail */}
                <div className="space-y-4">
                  {/* Info Akun */}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Email
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  {/* Info Bank (Jika backend kirim bank_name) */}
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Informasi Bank
                      </p>

                      {selectedUser.bank_name ? (
                        <p className="text-sm text-slate-600 flex gap-2">
                          {selectedUser.bank_name} {selectedUser.account} {selectedUser.bank_holder} 
                        </p>
                      ) : (
                        "Belum diatur"
                      )}
                    </div>
                  </div>

                  {/* Tanggal Join */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Bergabung Sejak
                      </p>
                      <p className="text-sm text-slate-600">
                        {selectedUser.createdAt
                          ? format(
                              new Date(selectedUser.createdAt),
                              "dd MMMM yyyy, HH:mm"
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={cloceModal}>
                    Tutup
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
