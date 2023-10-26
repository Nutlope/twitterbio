import Image from "next/image";

type User = {
  firstName: string;
  lastName: string;
  username: string;
  imageUrl: string;
};

export function UserInfo(props: { user: User }) {
  return (
    <div className="group block shrink-0">
      <div className="flex items-center">
        <div>
          <Image
            className="inline-block h-9 w-9 rounded-full"
            src={props.user.imageUrl}
            alt=""
            width={375}
            height={375}
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {props.user.firstName} {props.user.lastName}
          </p>
          <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
            @{props.user.username}
          </p>
        </div>
      </div>
    </div>
  );
}
