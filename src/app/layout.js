import "./globals.css";
import AuthProvider from './components/AuthProvider';

export const metadata = {
  title: "Job Hunt HQ",
  description: "AI-powered Job Tracker & Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
