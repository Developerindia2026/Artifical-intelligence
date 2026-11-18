import '@/app/globals.css';
import React from 'react';

interface RootProp {
  children: React.ReactNode;
}

export default function Rootlayout({ children }: RootProp) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Artifical-Intelligence</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
