"use client";
import Hero from "@/components/home/hero/Hero";
import RecentNews from "@/components/home/RecentNews/RecentNews";
import RecentSearch from "@/components/home/RecentSearch/RecentSearch";
import ThematicAreas from "@/components/home/ThematicAreas/ThematicAreas";
import RecentEvents from "@/components/home/RecentEvents/RecentEvents";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      console.log("Usuário autenticado automaticamente");
    }
  }, [router]);

  return (
    <>
      <Hero />
      <ThematicAreas />
      <RecentSearch />
      <RecentNews />
      <RecentEvents />
    </>
  );
};

export default Home;
