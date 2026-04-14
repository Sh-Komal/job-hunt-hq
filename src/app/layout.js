import "./globals.css";

export const metadata = {
  title: "Komal's Job Hunt HQ",
  description: "AI-powered Job Tracker & Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          {children}
        </div>
      </body>
    </html>
  );
}
