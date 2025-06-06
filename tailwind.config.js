module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "card-bg": "var(--card-bg)",
        "card-border": "var(--card-border)",
        "input-bg": "var(--input-bg)",
        "input-border": "var(--input-border)",
        "input-text": "var(--input-text)",
        "button-bg": "var(--button-bg)",
        "button-text": "var(--button-text)",
        "sidebar-bg": "var(--sidebar-bg)",
        "sidebar-hover": "var(--sidebar-hover)",
        "sidebar-active": "var(--sidebar-active)",
        "header-bg": "var(--header-bg)",
        "table-header-bg": "var(--table-header-bg)",
        "table-border": "var(--table-border)",
        "hover-bg": "var(--hover-bg)",
      },
    },
  },
};
