"use client";

import { UserInfo } from "@/components/UserInfo";
import { api } from "@/trpc/react";

type Props = { params: { userName: string } };

export default function Page() {
  const params = { userName: "jaronhearddev" };
  const users = api.user.getFollowing.useQuery({
    userName: params.userName,
  });

  return (
    <>
      <div className="flex place-items-center gap-2">
        <div className="font-medium">Users followed by</div>
        <div className="font-bold">{params.userName}</div>
      </div>
      <div className="p-4"></div>
      <div className="grid grid-cols-1 gap-4">
        {users.isLoading && <div>Loading...</div>}
        {users.isError && <div>Error loading users.</div>}
        {users.data?.map((user) => (
          <p key={user.Following.username}> {user.Following.username} </p>
        ))}
      </div>
      <div className="p-4"></div>
    </>
  );
}
