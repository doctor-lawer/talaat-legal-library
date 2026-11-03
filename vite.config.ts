import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/talaat-legal-library/', // هذا هو السطر المسؤول عن ضبط المسار ليعمل موقعك بشكل صحيح على جيت هاب
});
