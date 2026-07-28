/**
 * Design Tokens for ProjectHub Workspace Replica
 * Contains configurable layout styles to match the screenshots.
 */
export const designTokens = {
  colors: {
    // Left narrow sidebar (burgundy/plum)
    sidebarLeftBg: "#4c0519",
    sidebarLeftLogoBg: "#881337",
    sidebarLeftIconColor: "#ffffff",
    sidebarLeftIconOpacity: "0.75",
    sidebarLeftIconActiveBg: "#ffffff",
    sidebarLeftIconActiveColor: "#9d174d",

    // Middle Home sidebar
    sidebarMiddleBg: "#f8f9fa",
    sidebarMiddleBorder: "#eef1f6",
    sidebarMiddleText: "#334155",
    sidebarMiddleTextHover: "#1e293b",
    sidebarMiddleTextSelected: "#9d174d",
    sidebarMiddleBgSelected: "#fff1f2",

    // General layout background and text
    mainBg: "#ffffff",
    panelBg: "#f8fafc",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    borderLight: "#e2e8f0",
    borderMedium: "#cbd5e1",

    // Interactive states
    hoverBg: "#f1f5f9",
    activeBg: "#e2e8f0",
    focusRing: "rgba(157, 23, 77, 0.2)",
    
    // Status colors
    statusTodo: "#64748b",
    statusInProgress: "#be185d",
    statusReview: "#a855f7",
    statusDone: "#10b981",
    
    // Badge colors
    badgeRed: "#ef4444",
    badgeGreen: "#22c55e",
  },
  
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },

  typography: {
    fontFamily: "'Inter', sans-serif",
    sizes: {
      xs: "11px",
      sm: "13px",
      base: "14px",
      lg: "16px",
      xl: "18px",
      xxl: "20px",
      title: "24px",
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    }
  },

  borders: {
    radiusSm: "4px",
    radiusMd: "6px",
    radiusLg: "8px",
    radiusXl: "12px",
    radiusFull: "9999px",
    widthThin: "1px",
    widthThick: "2px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  }
};

export default designTokens;
