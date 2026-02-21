import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SiteOwnerAvatar = () => {
  return (
    <Avatar className="size-10">
      <AvatarImage src="/img/avatar.jpg" />
      <AvatarFallback>唯</AvatarFallback>
    </Avatar>
  );
};

export default SiteOwnerAvatar;
