import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memo } from "react";

interface User {
  fullname: string;
  imageUrl?: string; // Optional: Image URL
  alt?: string;
  size?: string;
  gender?: string;
}

const UserAvatar: React.FC<User> = ({
  fullname,
  imageUrl,
  alt,
  size = "w-[80px] h-[80px]",
  gender = "male"
}) => {
  return (
    <Avatar
      className={`border-4 border-indigo-500/50 flex items-center justify-center ${size}`}
    >
      <AvatarImage
        src={imageUrl && imageUrl ? `https://lh3.googleusercontent.com/d/${imageUrl}=s400` : gender === "male" ? "/assets/maleicon.gif" : "/assets/femaleicon.gif"}
        alt={alt || "User"}
        className="object-cover"
      />
      <AvatarFallback>
        {fullname
          ? fullname
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
          : "DD"}
      </AvatarFallback>
    </Avatar>
  );
};

export default memo(UserAvatar);
