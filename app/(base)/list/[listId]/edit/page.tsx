import AddListCard from "@/components/AddListCard";
import { api } from "@/trpc/server";

export default async function Page({ params }: { params: { listId: string } }) {
  const list = await api.list.get.query({ listId: params.listId });

  if (!list) {
    return <p className="text-lg text-gray-500">No list found.</p>;
  }

  return (
    <AddListCard
      name={list.name}
      description={list.description}
      update
      updateId={list.id}
    />
  );
}
