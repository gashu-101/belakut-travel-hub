import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, BellRing, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/notificationApi';
import { formatETB } from '@/lib/currency';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getUserNotifications,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return 'Hotel';
      case 'payment':
        return 'Payment';
      case 'warning':
        return 'Warning';
      default:
        return 'Info';
    }
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group hover:bg-slate-100 transition-all duration-300">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-blue-600 animate-pulse" />
          ) : (
            <Bell className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-red-600 border-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 bg-white border-0 shadow-2xl rounded-xl">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-xl">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs hover:bg-white transition-colors"
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">No notifications yet</p>
              <p className="text-slate-400 text-xs mt-1">New updates will appear here</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 cursor-pointer border-b last:border-b-0 transition-all duration-300 ${
                  !notification.read 
                    ? 'bg-gradient-to-r from-blue-50 to-slate-50 hover:from-blue-100 hover:to-slate-100' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">
                      {getNotificationIcon(notification.type).charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm text-slate-800 truncate">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    {notification.metadata && notification.metadata.total_amount && (
                      <div className="text-xs font-semibold text-green-600 mb-1">
                        {formatETB(notification.metadata.total_amount)}
                      </div>
                    )}
                    <p className="text-xs text-slate-400">
                      {formatNotificationTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-b-xl">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs hover:bg-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
