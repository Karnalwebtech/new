import { User } from "@/types/user-type";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { memo } from "react";
interface ProfileCompletionProps {
  user: User;
}
const ProfileCompletion = ({ user }: ProfileCompletionProps) => {
  const fields: (keyof User)[] = [
    "name",
    "email",
    "profile_image",
    "bio",
    "gender",
    "phone",
  ];

  const filledFields = fields.filter(
    (field) => user?.[field] !== null && user?.[field] !== ""
  ).length;

  const completionPercentage = Math.round((filledFields / fields.length) * 100);

  return (
    <Card className="w-full md:w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{completionPercentage}%</div>
          <Badge variant={completionPercentage === 100 ? "default" : "outline"}>
            {completionPercentage === 100 ? "Complete" : "In Progress"}
          </Badge>
        </div>
        <Progress value={completionPercentage} className="mt-2" />
      </CardContent>
    </Card>
  );
};

export default memo(ProfileCompletion);
