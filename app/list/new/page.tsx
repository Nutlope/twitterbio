"use client";

import { useSearchParams } from "next/navigation";
import AddListCard from "@/components/AddListCard";

export default function Page() {
  const searchParams = useSearchParams();
  const afterSuccess = searchParams.get("afterSuccess") || "";
  return <AddListCard name="" description="" afterSuccess={afterSuccess} />;
}
