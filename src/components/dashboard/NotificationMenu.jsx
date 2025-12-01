"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
        // Hitung yang belum dibaca
        const count = res.data.filter(n => !n.isRead).length;
        setUnreadCount(count);
      } catch (error) {
        console.error("Gagal ambil notif");
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []); 

  // Saat lonceng diklik -> Tandai sudah baca
  const handleOpenChange = async (open) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      try {
        await api.patch("/notifications/read");
        setUnreadCount(0); 
        setNotifications(prev => prev.map(n => ({...n, isRead: true})));
      } catch (error) {
        console.error("Gagal update read");
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b bg-slate-50">
            <h4 className="font-semibold text-sm">Notifikasi</h4>
        </div>
        
        <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                    Tidak ada notifikasi baru.
                </div>
            ) : (
                <div className="divide-y">
                    {notifications.map((item) => (
                        <div key={item.id} className={`p-4 hover:bg-slate-50 transition ${!item.isRead ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-medium ${!item.isRead ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {item.title}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: idLocale })}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">
                                {item.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}