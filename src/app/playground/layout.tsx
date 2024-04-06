import React from "react";

export default function Layout({ children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="min-h-screen bg-black">
      <header className="bg-blue-500 text-white text-center py-4">
        <h1 className="text-2xl font-semibold">Writing Prompt Generator</h1>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}