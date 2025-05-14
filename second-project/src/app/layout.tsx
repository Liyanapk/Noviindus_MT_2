import type { Metadata } from "next";
import './globals.css'


interface Props {
    children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "MT 2",
  description: "NexLearn app",
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        {children}
        </body>
    </html>
  );
}
