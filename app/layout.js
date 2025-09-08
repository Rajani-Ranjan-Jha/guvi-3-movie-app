'use client'
import "./globals.css";
import { SessionWrapper } from "./components/SessionWrapper";
import { ContextProvider } from "./context/contextProvider";
import Navbar from "./components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Movie Master</title>
      </head>
      <body
        className={`dark`}
      >
        <SessionWrapper>
          <ContextProvider>
            {children}
          </ContextProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
