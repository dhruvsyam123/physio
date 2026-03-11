"use client";

import { useState } from "react";
import {
  Bell,
  FileText,
  Dumbbell,
  Sparkles,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "referral" | "exercise" | "insight" | "appointment" | "message";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const typeIcons: Record<Notification["type"], React.ReactNode> = {
  referral: <FileText className="h-4 w-4 text-blue-500" />,
  exercise: <Dumbbell className="h-4 w-4 text-emerald-500" />,
  insight: <Sparkles className="h-4 w-4 text-purple-500" />,
  appointment: <Calendar className="h-4 w-4 text-teal-500" />,
  message: <MessageSquare className="h-4 w-4 text-amber-500" />,
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "referral",
    title: "New referral received",
    description:
      "Dr. Johnson referred Sarah Williams for shoulder rehabilitation",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "exercise",
    title: "Home exercises completed",
    description: "James Mitchell completed today's exercise programme",
    time: "25 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "insight",
    title: "AI Insight",
    description:
      "Emma Wilson's pain scores have plateaued \u2014 review treatment plan",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "appointment",
    title: "Appointment confirmed",
    description: "Robert Taylor confirmed 2:30 PM appointment",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "message",
    title: "New message",
    description: "Margaret Chen sent a message about her exercises",
    time: "3 hours ago",
    read: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleNotificationClick(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
          />
        }
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4.5 min-w-[1.125rem] items-center justify-center rounded-full px-1 text-[10px] font-semibold">
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          <div className="divide-y">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="mt-0.5 shrink-0">
                  {typeIcons[notification.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium truncate">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                    {notification.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {notification.time}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
