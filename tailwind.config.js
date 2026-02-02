/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
        foreground: '#1F2937',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        secondary: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        destructive: '#EF4444',
        muted: '#F3F4F6',
        'muted-foreground': '#9CA3AF',
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#3B82F6',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [],
}

