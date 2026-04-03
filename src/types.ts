export interface User {
  id: number;
  name: string;
  phone: string;
  shop_name: string;
  photo_url?: string;
}

export interface Customer {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address?: string;
  total_due: number;
  total_paid: number;
  created_at: string;
}

export interface Transaction {
  id: number;
  customer_id: number;
  user_id: number;
  amount: number;
  type: 'credit' | 'debit';
  note?: string;
  date: string;
}

export interface DashboardStats {
  total_customers: number;
  total_due: number;
  today_transactions: number;
}
