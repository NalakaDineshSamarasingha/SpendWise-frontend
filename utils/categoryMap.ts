import colors from "@/constants/color";

export interface CategoryIconColor {
  icon: string;
  color: string;
}

export const getIconColorForCategory = (category?: string): CategoryIconColor => {
  const key = (category || '').toLowerCase();
  switch (key) {
    case 'shopping': return { icon: 'shopping-bag', color: colors.border };
    case 'food': return { icon: 'coffee', color: colors.border  };
    case 'transportation': return { icon: 'truck', color: colors.border  };
    case 'subscription': return { icon: 'tv', color: colors.border  };
    case 'entertainment': return { icon: 'film', color: colors.border  };
    case 'bills': return { icon: 'file-text', color: colors.border  };
    case 'health': return { icon: 'heart', color: colors.border  };
    case 'salary':
    case 'income': return { icon: 'dollar-sign', color: colors.border  };
    case 'expense': return { icon: 'arrow-down-right', color: colors.border  };
    default: return { icon: 'dollar-sign', color: colors.border  }; // neutral fallback
  }
};
