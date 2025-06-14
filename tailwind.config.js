/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        success: {
          DEFAULT: "#48bb78",
          light: "#9ae3b1",
          dark: "#2f855a",
          foreground: "#fff",
        },
        error: {
          DEFAULT: "#f56565",
          light: "#feb2b2",
          dark: "#c53030",
          foreground: "#fff",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    colors: {
      "black-primary": "#1f1f1f",
      "black-secondary": "#292929",
      "black-tertiary": "#3d3d3d",
      "white-primary": "#ffffff",
      "white-secondary": "#e6e6e6",
      "white-tertiary": "#828282",
      "gray-primary": "#c0c0c0",
      "gray-secondary": "#adadad",
      "gray-tertiary": "#959595",
      "transparent-primary": "#00000000",
      "blue-primary": "#cddfdf",
      "blue-secondary": "#dce9e9",
      "blue-tertiary": "#ecf3f3",
      "yellow-primary": "#FFD700",
      "red-primary": "#ef233b",
    },
    animation: {
      "fade-in": "fadeIn 1s ease-in-out forwards",
      "fade-in-quick": "fadeIn 0.5s ease-in-out forwards",
      "fade-in-up": "fadeInUp 1s ease-out forwards",
      "spin": "spin 2s linear infinite",
      "ping": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0, transform: "scale(0.95)" },
        "100%": { opacity: 1, transform: "scale(1)" },
      },
      fadeInUp: {
        "0%": { opacity: "0", transform: "translateY(100px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
