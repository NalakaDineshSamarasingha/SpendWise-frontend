export interface CategoryIconColor {
  icon: string;
  color: string;
}

export const getIconColorForCategory = (category?: string): CategoryIconColor => {
  const key = (category || '').toLowerCase();
  switch (key) {
    case 'shopping': return { icon: 'shopping-bag', color: '#fb923c' };
    case 'food': return { icon: 'coffee', color: '#ef4444' };
    case 'transportation': return { icon: 'truck', color: '#60a5fa' };
    case 'subscription': return { icon: 'tv', color: '#8B5CF6' };
    case 'entertainment': return { icon: 'film', color: '#ec4899' };
    case 'bills': return { icon: 'file-text', color: '#f59e0b' };
    case 'health': return { icon: 'heart', color: '#10b981' };
    case 'salary':
    case 'income': return { icon: 'dollar-sign', color: '#22c55e' };
    case 'expense': return { icon: 'arrow-down-right', color: '#ef4444' };
    default: return { icon: 'dollar-sign', color: '#6B7280' }; // neutral fallback
  }
};
