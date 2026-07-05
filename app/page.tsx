import Hero from "@/components/hero/Hero";
import Navbar from "@/components/hero/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) {
    redirect("/workspace");
  }

  return (
    <>
      <Navbar />
      <Hero  />
    </>
  );
}
