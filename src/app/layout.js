import "./globals.css";
import AuthProvider from './components/AuthProvider';

export const metadata = {
  title: "CareerPilot — Smart Job Application Tracker",
  description: "Track applications, manage recruiter outreach, and accelerate your job search with AI-powered insights.",
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
