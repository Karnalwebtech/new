import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SocialProfile from "./socile-profile/social-profile"

export function ProfileSocial() {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Profiles</CardTitle>
        <CardDescription>Connect your social media accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialProfile />
      </CardContent>

    </Card>
  )
}

