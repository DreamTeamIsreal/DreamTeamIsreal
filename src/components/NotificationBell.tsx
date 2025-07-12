import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Bell } from 'lucide-react';
import apiService, { NotificationItem } from '../lib/api';
import { useTranslation } from 'react-i18next';

const NotificationBell: FC = () => {
  const { t } = useTranslation(['notification','common']);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    const res = await apiService.getNotifications();
    if (res.success && res.data) {
      setNotifications(res.data);
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    const ids = notifications.filter(n => !n.isRead).map(n => n.id);
    if (!ids.length) return;
    const res = await apiService.markNotificationsRead(ids);
    if (res && res.success) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  return (
    <div className="relative group">
      <button
        aria-label={t('notification:bell')}
        onClick={markAllRead}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;