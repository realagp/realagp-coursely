"use client";

import { useEffect, useState } from "react";
import { BellIcon, BellMinusIcon, Loader2,} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getUserNotifications, Notification } from "@/app/data/notifications/get-user-notifications";

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    const res = await fetch("/api/notifications/mark-all-read", {
      method: "POST",
    });

    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const res = await fetch(`/api/notifications/mark-read?id=${id}`, {
      method: "POST",
    });

    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/notifications/delete/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative size-8 rounded-full"
        >
          <BellIcon size={16} />
          {unreadCount > 0 && (
            <div className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 md:w-80 p-2 py-0 m-2">
        <div className="flex items-center justify-between my-2">
          <span className="text-sm text-muted-foreground font-semibold flex items-center">
            <BellIcon className="size-4 mr-1" />Notifications
          </span>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs font-medium"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="border-t my-1" />

        {loading ? (
          <div className="flex items-center p-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin mr-2" />Loading
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto notif-scrollbar-hidden">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="hover:bg-accent bg-accent/50 rounded-md p-2 my-2 text-sm transition-colors"
              >
                <div className="relative flex items-start pe-3 gap-2">
                  {/* Unread indicator */}
                  {!n.isRead && (
                    <div className="absolute right-0 top-1 text-destructive">
                      <span className="sr-only">Unread</span>
                      <Dot />
                    </div>
                  )}                
                  <div className="flex-1 space-y-1">
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-left text-foreground/80 after:absolute after:inset-0"
                    >
                      <span className="font-medium text-foreground hover:underline">
                        {n.message}
                      </span>
                    </button>
                    <div className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-destructive hover:text-destructive absolute right-0 bottom-0.5 cursor-pointer">
                    <BellMinusIcon className="size-4"/>
                    <span className="sr-only">Delete</span>
                  </button>     
                </div>         
              </div>
            ))}            
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
