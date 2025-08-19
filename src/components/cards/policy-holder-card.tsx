"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AtSign,
  BadgeCheck,
  Calendar,
  CreditCard,
  Eye,
  Hash,
  Loader2,
  Smartphone,
  SquareX,
  User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/services/currency";
import LinkTooltip from "../tooltip/link-tooltip";
import { formatDate } from "@/services/helpers";
import { Result } from "@/types/policy-holder-type";
import { memo, useCallback } from "react";
import { Button } from "../ui/button";
import { useRemovePolicyHolderMutation } from "@/state/policy-holder-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { ImageFallback } from "../files/image-fallback";

interface PolicyHolderCardProps {
  item: Result;
}

const PolicyHolderCard = ({ item }: PolicyHolderCardProps) => {

  const [removePolicyHolder, { isLoading, isSuccess, error }] =
    useRemovePolicyHolderMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Holder Removed succesfuly.",
  });
  const removeHandler = useCallback(
    async (id: string) => {
      await removePolicyHolder({ id });
    },
    [removePolicyHolder]
  );
  return (
    <div className="w-full mx-auto relative z-0">
      <Card className="overflow-hidden rounded-lg border-none shadow-lg">
        <div className="relative h-28 bg-gradient-to-r from-primary/80 to-primary">
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <ImageFallback
              src={`https://lh3.googleusercontent.com/d/${item.profile_image?.public_id}=s300`}
              alt="item.fullname"
              className="w-[130px] h-[130px] rounded-full overflow-hidden object-cover border-4 border-indigo-500/50 "
            />
          </div>
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            <Badge variant="secondary">{item.category}</Badge>
            {Boolean(item.is_active) && (
              <Badge className="flex items-center bg-green-500 text-white gap-1">
                <BadgeCheck className="h-3.5 w-3.5" />
                Active
              </Badge>
            )}
            {!item.is_active && (
              <Badge className="bg-red-500 text-white">Inactive</Badge>
            )}
          </div>

          {/* Action Links */}
          <div className="absolute right-2 top-2 flex gap-2">
            <LinkTooltip
              Icon={Smartphone}
              description={item.phone}
              path={`tel:${item.phone}`}
            />
            <LinkTooltip
              Icon={AtSign}
              description={item.email}
              path={`mailto:${item.email}`}
            />
            <LinkTooltip Icon={Hash} description={item.policy_no} />
          </div>
          <div className="absolute right-2 top-12 flex gap-2">
            <Button variant={"outline"} className="w-0">
              <Eye />
            </Button>
            <Button
              variant={"outline"}
              className="w-0 text-red-700"
              onClick={() => removeHandler(item?._id)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SquareX />
              )}
            </Button>
          </div>
        </div>

        {/* Header */}
        <CardHeader className="pt-20 pb-0 text-center">
          <h2 className="text-2xl font-bold">{item.fullname}</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
            <CreditCard className="h-4 w-4" />
            Policy: {item.policy_no}
          </p>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="pt-2 space-y-2 p-2">
          {/* Basic Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Premium: {item.premium_mode}</span>
            </div>
          </div>

          {/* Date Information */}
          <div className="space-y-2">
            {[
              { icon: Calendar, label: "Policy date", value: item.dop },
              { icon: Calendar, label: "Renewal", value: item.dor },
              {
                icon: Calendar,
                label: "Issue year",
                value: item.issue_policy_year,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {label}: {formatDate(value)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { label: "Sum Insured", value: item.si },
              { label: "Premium Amount", value: item.amount },
            ].map(({ label, value }) => (
              <div key={label} className="bg-primary/5 p-2 rounded-lg">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-sm font-bold">{formatCurrency(value)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(PolicyHolderCard);
