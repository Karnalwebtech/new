import { MoreVertical, Folder } from "lucide-react"
import { Button } from "../../../components/ui/button"

export function FolderGrid() {
  const folders = [
    { name: "Tivo admin", files: "20 file", time: "7 hour ago" },
    { name: "Viho admin", files: "14 file", time: "2 Day ago" },
    { name: "Unice admin", files: "15 file", time: "1 Day ago" },
    { name: "Koho admin", files: "10 file", time: "1 Day ago" },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Folders</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {folders.map((folder) => (
          <div key={folder.name} className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-start gap-4">
              <Folder className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">{folder.name}</h3>
                <p className="text-sm text-muted-foreground">{folder.files}</p>
                <p className="text-sm text-muted-foreground">{folder.time}</p>
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

