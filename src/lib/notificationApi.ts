
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'booking' | 'payment' | 'warning';
  read: boolean;
  related_booking_id?: string;
  metadata?: any;
}

export async function getUserNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    throw new Error(error.message);
  }

  return data as Notification[];
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    throw new Error(error.message);
  }
}

export async function markAllNotificationsAsRead() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error(error.message);
  }
}

export async function approvePayment(bookingId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      payment_approved: true,
      payment_approved_by: user.id,
      payment_approved_at: new Date().toISOString(),
      status: 'confirmed'
    })
    .eq("id", bookingId);

  if (error) {
    console.error("Error approving payment:", error);
    throw new Error(error.message);
  }
}
