import { MoreVertical, FileText, FileSpreadsheet, FileArchive } from "lucide-react"
import { Button } from "../../../components/ui/button"

export function FileList() {
  const files = [
    {
      name: "Logo.psd",
      icon: FileText,
      size: "2.0 MB",
      time: "7 hour ago",
    },
    {
      name: "Backend.xls",
      icon: FileSpreadsheet,
      size: "3.0 GB",
      time: "2 Day ago",
    },
    {
      name: "Project.zip",
      icon: FileArchive,
      size: "1.9 GB",
      time: "1 Day ago",
    },
    {
      name: "Report.txt",
      icon: FileText,
      size: "0.9 KB",
      time: "1 Day ago",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Files</h2>
      <div className="divide-y rounded-lg border">
        {files.map((file) => (
          <div key={file.name} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <file.icon className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {file.time} • {file.size}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

