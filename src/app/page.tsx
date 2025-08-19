"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard"); // Redirect to the dashboard page
  }, [router]);

  return null; // Optionally, you can return a loading spinner or message
};

export default Home;
