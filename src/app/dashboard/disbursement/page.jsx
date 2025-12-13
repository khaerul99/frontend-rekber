"use client";

import { Banknote, UploadCloud, Undo2 , Copy} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDisbursement } from "@/hooks/dashboard/disbursement/useDisbursement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PinModal from "@/components/dashboard/PinModal";

  const TransactionTable = ({ data, type, openUploadModal,copyText }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kode TRX</TableHead>
          <TableHead>{type === 'DISBURSE' ? 'Penjual' : 'Pembeli'}</TableHead>
          <TableHead>Rekening Tujuan</TableHead>
          <TableHead>Nominal</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((trx) => {
          const user = type === 'DISBURSE' ? trx.seller : trx.buyer;
          const amount = type === 'DISBURSE' 
            ? parseFloat(trx.amount) 
            : parseFloat(trx.total_transfer); 

          return (
            <TableRow key={trx.id}>
              <TableCell className="font-mono font-medium">{trx.trx_code}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                    <span className="font-bold">{user?.username}</span>
                    <span className="text-xs text-slate-500">{user?.email}</span>
                </div>
              </TableCell>
              <TableCell>
                {user?.bank_account ? (
                    <div className="space-y-1">
                        <Badge variant="outline">{user.bank_name} - {user.bank_account}
                          <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-blue-600 shrink-0"
                                onClick={() => copyText(user.bank_account)}
                              >
                               <Copy size={14} />
                              </Button>
                        </Badge>
                        <p className="text-xs text-slate-500">a.n {user.bank_holder}</p>
                    </div>
                ) : (
                    <Badge variant="destructive">Belum set rekening</Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="font-bold text-lg text-slate-700">
                    Rp {amount.toLocaleString("id-ID")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                    size="sm" 
                    className={type === 'DISBURSE' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                    onClick={() => openUploadModal(trx, type)}
                    disabled={!user?.bank_account}
                >
                    <UploadCloud size={16} className="mr-2" /> 
                    {type === 'DISBURSE' ? 'Sudah Transfer' : 'Refund'}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

export default function DisbursementPage() {
  const { transactions, isModalOpen, refunds, isPinOpen, actionType, uploading, onUploadSubmit,executeDisbursement,openUploadModal, setIsPinOpen, handleSubmit,setIsModalOpen, copyText, setProofFile} = useDisbursement();



  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kelola Dana Keluar</h1>

      <Tabs defaultValue="disburse" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="disburse" className="gap-2"><Banknote size={16}/> Pencairan Penjual</TabsTrigger>
          <TabsTrigger value="refund" className="gap-2"><Undo2 size={16}/> Refund Pembeli</TabsTrigger>
        </TabsList>

        <TabsContent value="disburse">
          <Card>
            <CardHeader><CardTitle>Antrian Pencairan ({transactions.length})</CardTitle></CardHeader>
            <CardContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full overflow-x-auto">
                {transactions.length === 0 ? <p className="text-center py-8 text-slate-500">Kosong.</p> : <TransactionTable data={transactions} type="DISBURSE" openUploadModal={openUploadModal} copyText={copyText} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refund">
          <Card>
            <CardHeader><CardTitle>Antrian Refund ({refunds.length})</CardTitle></CardHeader>
            <CardContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-full overflow-x-auto">
                {refunds.length === 0 ? <p className="text-center py-8 text-slate-500">Tidak ada refund.</p> : <TransactionTable data={refunds} type="REFUND"  openUploadModal={openUploadModal} copyText={copyText}/>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL UPLOAD */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Upload Bukti {actionType === 'DISBURSE' ? 'Transfer' : 'Refund'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <Input type="file" accept="image/*" onChange={(e) => setProofFile(e.target.files[0])} />
            </div>
            <DialogFooter>
                <Button onClick={onUploadSubmit} disabled={uploading}>{uploading ? "Mengupload..." : "Kirim"}</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <PinModal 
          isOpen={isPinOpen} 
          onClose={() => setIsPinOpen(false)}
          onSuccess={executeDisbursement} 
      />
    </div>
  );
}