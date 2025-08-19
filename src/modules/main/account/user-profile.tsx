"use client";
import {
  Calendar,
  Globe,
  Lock,
  Phone,
  Shield,
  UserIcon,
  UserCheck,
  UserPen,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileStats } from "./profile-stats";
import { ProfileSecurity } from "./profile-security";
import { ProfileSocial } from "./profile-social";
import LazyImage from "@/components/LazyImage";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ProfileCompletion from "./profile-completion";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { formatDate } from "@/services/helpers";
import { RecentActivity } from "@/components/cards/recent-activity";
import { useGetAuditUserQuery } from "@/state/auth-api";
import { AuditLog } from "@/types/audit-user-type";

export function UserProfile() {
  const user = useSelector((state: RootState) => state?.user?.user);
  const { data, isLoading } = useGetAuditUserQuery({
    rowsPerPage: 5,
    page: 1,
  });

  const result: AuditLog[] | undefined = data?.result;

  if (!user) {
    return null;
  }
  return (
    <>
      <div className="space-y-8 p-2 lg:p-4">
        {/* Header with profile completion */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <ProfileCompletion user={user} />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="overflow-hidden rounded-full border-4 border-primary/50">
                      <LazyImage
                        src={
                          user?.profile_image
                            ? user?.profile_image?.public_id
                            : ""
                        }
                        style="w-[130px] h-[130px] bg-gray-800"
                        alt="Profile image"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <UserCheck className="h-3 w-3" />
                      {user?.role}
                    </Badge>
                    {user?.isVerified && (
                      <Badge className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Separator />
                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>User ID</span>
                      </div>
                      <span className="font-medium">{user?.user}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Date of Birth</span>
                      </div>
                      <span className="font-medium">
                        {user?.dateOfBirth
                          ? formatDate(user?.dateOfBirth)
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>Phone</span>
                      </div>
                      <span className="font-medium">{user?.phone || ""}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>Language</span>
                      </div>
                      <span className="font-medium">
                        {/* {user?.preferences?.language === "en" ? "English" : user?.preferences?.language} */}
                        English
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span>2FA</span>
                      </div>
                      <Badge
                        variant={user?.is2FAEnabled ? "default" : "outline"}
                      >
                        {user?.is2FAEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                  <NavigateBtn
                    path={"/dashboard/account/edit-profile"}
                    Icon={UserPen}
                    title={"Edit Profile"}
                    disabled={false}
                    style={"bg-black w-full text-gray-100"}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Bio</CardTitle>
                    <CardDescription>
                      Tell others a little about yourself
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{user?.bio || "No bio provided."}</p>
                  </CardContent>
                </Card>
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>
                      Your current plan and benefits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold capitalize">
                          {user?.subscriptionPlan} Plan
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user?.subscriptionPlan === "premium"
                            ? "Access to all premium features"
                            : user?.subscriptionPlan === "enterprise"
                            ? "Full enterprise support and features"
                            : "Basic features"}
                        </p>
                      </div>
                      <Button variant="outline">Upgrade</Button>
                    </div>
                  </CardContent>
                </Card> */}
                <ProfileStats user={user} />
              </TabsContent>
              <TabsContent value="activity" className="pt-4">
                <RecentActivity result={result || []} isLoading={isLoading} />
                <NavigateBtn
                  path="/dashboard/recent-activity"
                  title="Load More"
                />
              </TabsContent>
              <TabsContent value="social" className="pt-4">
                <ProfileSocial />
              </TabsContent>
              <TabsContent value="password" className="pt-4">
                <ProfileSecurity />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
