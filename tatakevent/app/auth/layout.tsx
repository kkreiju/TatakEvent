import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center">
      <BackgroundBeams className="absolute inset-0" />
      {children}
    </div>
  );
};

export default Layout;
