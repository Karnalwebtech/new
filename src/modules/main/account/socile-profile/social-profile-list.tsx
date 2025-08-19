import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/services/helpers";
import {
  useGetAllSocialProfileQuery,
  useRemoveSocialProfileMutation,
} from "@/state/social-profile-api";
import React, { JSX, memo, useCallback, useState } from "react";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  PlusCircle,
  ExternalLink,
  Edit,
  Trash2,
} from "lucide-react";
import {
  FaSnapchatGhost,
  FaTiktok,
  FaPinterest,
  FaReddit,
  FaDiscord,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import SocialProfilesSkeleton from "@/components/skeletons/social-profiles-skeleton";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import EventTooltip from "@/components/tooltip/event-tooltip";
import { SocialProfileForm } from "@/types/social-profile-type";

const socialIcons: Record<string, JSX.Element> = {
  facebook: <Facebook className="h-6 w-6 text-blue-600" />,
  github: <Github className="h-6 w-6 text-gray-900" />,
  instagram: <Instagram className="h-6 w-6 text-pink-500" />,
  linkedin: <Linkedin className="h-6 w-6 text-blue-500" />,
  twitter: <Twitter className="h-6 w-6 text-blue-400" />,
  youtube: <Youtube className="h-6 w-6 text-red-600" />,
  snapchat: <FaSnapchatGhost className="h-6 w-6 text-yellow-500" />,
  tiktok: <FaTiktok className="h-6 w-6 text-black" />,
  pinterest: <FaPinterest className="h-6 w-6 text-red-600" />,
  reddit: <FaReddit className="h-6 w-6 text-orange-600" />,
  discord: <FaDiscord className="h-6 w-6 text-indigo-500" />,
  telegram: <FaTelegram className="h-6 w-6 text-blue-500" />,
  whatsapp: <FaWhatsapp className="h-6 w-6 text-green-500" />,
};

interface SocialProfileListProps {
  setIsFormOpen: (value: boolean) => void;
  setIsEditing: (value: string | null) => void;
  reset: (values?: Partial<SocialProfileForm>) => void;
}
const SocialProfileList = ({
  setIsFormOpen,
  setIsEditing,
  reset,
}: SocialProfileListProps) => {
  const [removeId, setRemoveId] = useState<string | null>(null);
  const { data, isLoading } = useGetAllSocialProfileQuery({
    rowsPerPage: 20,
    page: 1,
  });
  const [removeSocialProfile, { error, isSuccess }] =
    useRemoveSocialProfileMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Social Profile Removed succesfuly.",
  });
  const result = data?.result;

  const handleEdit = useCallback(
    (id: string | undefined) => {
      const profileToEdit = result?.find((profile) => profile._id === id);
      const edit = (id && id) || null;
      if (profileToEdit) {
        reset({
          // Reset form fields with existing data
          title: profileToEdit.title,
          platform: profileToEdit.platform,
          url: profileToEdit.url,
        });
        setIsEditing(edit);
        setIsFormOpen(true);
      }
    },
    [setIsEditing, result, setIsFormOpen, reset]
  );
  // Delete a profile
  const handleDelete = useCallback(
    async (id: string | undefined) => {
      const removeId = (id && id) || "";
      setRemoveId(removeId);
      await removeSocialProfile({ id: removeId });
    },
    [removeSocialProfile]
  );
  return (
    <>
      {isLoading ? (
        <SocialProfilesSkeleton />
      ) : result?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t added any social profiles yet.
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        result?.map((item?) => (
          <Card key={item?.id}>
            <CardContent className="p-2 lg:p-6">
              <div className="lg:flex items-start justify-between space-y-2 lg:space-y-0">
                <div className=" lg:flex items-start space-x-0 lg:space-x-4 space-y-2 lg:space-y-0">
                  <div>
                    {socialIcons[
                      item?.platform?.toLowerCase() as keyof typeof socialIcons
                    ] || <div className="h-6 w-6 bg-gray-300 rounded-full" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{item?.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{item?.platform}</span>
                      <span className="mx-2">•</span>
                      <a
                        href={item?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:underline text-primary"
                      >
                        {item?.url.replace(/^https?:\/\//, "").substr(0, 20)}...
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <span>Created: {formatDate(item?.createdAt || "")}</span>
                      <span className="mx-2">•</span>
                      <span>Updated: {formatDate(item?.updatedAt || "")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <EventTooltip
                    Icon={Edit}
                    title={"Edit"}
                    action={() => handleEdit(item?._id)}
                    description={"Edit"}
                    style="text-green-700"
                    isLoading={false}
                  />
                  <EventTooltip
                    Icon={Trash2}
                    title={"Delete"}
                    action={() => handleDelete(item?._id)}
                    description={"Delete"}
                    isLoading={removeId === item?._id}
                    style="text-red-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );
};

export default memo(SocialProfileList);
