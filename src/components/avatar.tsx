import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memo } from "react";

interface User {
  imageUrl?: string; // Optional: Image URL
  alt?: string;
  size?: string;
}

const Avatar: React.FC<User> = ({
  imageUrl,
  alt,
  size = "w-[80px] h-[80px]",
}) => {
  return (
    <Avatar
      className={`border-4 border-indigo-500/50 flex items-center justify-center ${size}`}
    >
      <AvatarImage
        src={imageUrl ? imageUrl : "/assets/femaleicon.gif"}
        alt={alt || "User"}
        className="object-cover"
      />
      <AvatarFallback>
        {alt
          ? alt
              .split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .toUpperCase()
          : "DD"}
      </AvatarFallback>
    </Avatar>
  );
};

export default memo(Avatar);
