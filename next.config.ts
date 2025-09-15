import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "semprenicea-back.onrender.com",
        port: "",
        pathname: "/api/files/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lvxvtvkhpfpcvazlorgp.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/uploads/**",
      },
    ],
  },
};

export default nextConfig;