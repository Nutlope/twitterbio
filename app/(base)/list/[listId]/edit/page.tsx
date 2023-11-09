import { db } from "@/lib/db";
import AddListCard from "@/components/AddListCard";

export default async function Page({ params }: { params: { listId: string } }) {
  const list = await db.list.findUnique({
    where: {
      id: params.listId,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
    },
  });

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
