import Image from "next/image";
import { InputForm } from "@/components/ui/input-form";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense>
        <InputForm/>
      </Suspense>
    </main>
  );
}
