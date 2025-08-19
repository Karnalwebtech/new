import { BarChartHorizontal, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MostVisitedPages() {
  const visitedPages = [
    { path: "/blog/top-10-writing-tips", visits: 1243, change: "+12%" },
    { path: "/projects/website-redesign", visits: 958, change: "+8%" },
    { path: "/blog/seo-strategies-2023", visits: 879, change: "+23%" },
    { path: "/about", visits: 645, change: "+5%" },
    { path: "/contact", visits: 439, change: "-2%" },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Most Visited Pages</CardTitle>
          <CardDescription>Top pages by user visits</CardDescription>
        </div>
        <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visitedPages.map((page) => (
            <div key={page.path} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{page.path}</p>
                <p className="text-sm text-muted-foreground">{page.visits.toLocaleString()} visits</p>
              </div>
              <div className={`text-sm ${page.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {page.change}
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-4 w-full">
            View All Analytics
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

