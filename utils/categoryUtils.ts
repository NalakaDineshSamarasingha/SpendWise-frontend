import type { Category } from '../components/transactions/CategorySelector';

export const categories: Category[] = [
  { name: 'Shopping', icon: 'bag-outline', color: '#FED7AA' },
  { name: 'Food', icon: 'restaurant-outline', color: '#FECACA' },
  { name: 'Transportation', icon: 'car-outline', color: '#BFDBFE' },
  { name: 'Subscription', icon: 'tv-outline', color: '#DDD6FE' },
  { name: 'Entertainment', icon: 'game-controller-outline', color: '#FBCFE8' },
  { name: 'House Hold', icon: 'home-outline', color: '#FBCFE8' },
  { name: 'Bills', icon: 'receipt-outline', color: '#FEF3C7' },
  { name: 'Health', icon: 'medical-outline', color: '#A7F3D0' },
  { name: 'Salary', icon: 'cash-outline', color: '#BBF7D0' },
  { name: 'Pocket Money', icon: 'cash-outline', color: '#BBF7D0' },
  { name: 'Gift', icon: 'cash-outline', color: '#BBF7D0' },
];

export const categoryMap = new Map(categories.map(c => [c.name, c]));
