"use client";

import { format } from "date-fns";
import { Search, Trash2, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
import { useUsers } from "@/hooks/dashboard/users/useUsers";
import AdminGuard from "@/components/adminGuard/AdminGuard";
import DataTable from "react-data-table-component";

export default function UserManagementPage() {
  const { users, filteredUsers, search, setSearch, loading, handleDelete } = useUsers();

  
  const columns = [
    {
      name: 'User',
      selector: row => row.username,
      sortable: true, // Fitur sort otomatis aktif
      width: '180px',
    },
    {
      name: 'role',
      selector: row => row.role,
      cell: (row) => (
        <div className="flex flex-col gap-2">
        <Badge variant="outline" className="bg-green-50">
           {row.role}
        </Badge>
        <p>
           {row.email}
        </p>
        </div>
      ),
      width: '200px',
      sortable: true,
    },
    {
      name: 'Status 2FA',
      selector: row => row.twofa_enabled,
      cell: (row) => (  
        row.twofa_enabled ? (
          <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
            <ShieldCheck size={14} /> Aktif
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <ShieldAlert size={14} /> Non-Aktif
          </div>
        )
    ),
    },
    {
      name: 'Tanggal Join',
      selector: row => row.createdAt,
      sortable: true,
      cell: (row) => format(new Date(row.createdAt), "dd MMM yyyy HH:mm"),
      width: '150px',

    },
   {   name: 'Aksi',
      selector: row => row.id,
      cell: (row) => (
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
      ),
      style: { display: 'flex', justifyContent: 'center' },
      ignoreRowClick: true, 
    },
  ];


  const customStyles = {
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#f8fafc', // slate-50
      },
    },
    rows: {
        style: {
            minHeight: '60px', // override the row height
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
            progressComponent={<div className="p-10"><Loader2 className="animate-spin" /></div>}
            highlightOnHover
            pointerOnHover
            noDataComponent={<div className="p-10 text-slate-500">Tidak ada data user.</div>}
          />
        </CardContent>
      </Card>
    </div>
    </AdminGuard>
  );
}
