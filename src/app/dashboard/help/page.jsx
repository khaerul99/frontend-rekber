import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pusat Bantuan</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> Pertanyaan Umum (FAQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Berapa lama proses pencairan dana?</AccordionTrigger>
                <AccordionContent>
                  Pencairan dana ke penjual diproses maksimal 1x24 jam setelah pembeli mengkonfirmasi `Selesai``.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Apa itu biaya admin (Fee)?</AccordionTrigger>
                <AccordionContent>
                  Biaya admin adalah biaya jasa rekber yang ditanggung oleh pembeli/penjual sesuai kesepakatan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Bagaimana jika barang tidak sesuai?</AccordionTrigger>
                <AccordionContent>
                  Jangan klik `Selesai``. Segera klik tombol `Ajukan Komplain`` di halaman detail transaksi.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5"/> Butuh Bantuan Admin?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">Jika Anda mengalami kendala transaksi atau indikasi penipuan, segera hubungi Admin resmi kami.</p>
            <a href="https://wa.me/6281234567890" target="_blank">
                <Button className="w-full bg-green-600 hover:bg-green-700">Chat WhatsApp Admin</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}