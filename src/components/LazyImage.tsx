import { FileArchive } from "lucide-react"
import Image from "next/image"

interface LazyImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    mimetype?: string | undefined
    style?: string;
}

export default function LazyImage({ src, alt, width = 500, height = 500, mimetype = "image/", style="w-full h-full" }: LazyImageProps) {

    const renderPreview = () => {
        if (mimetype.startsWith("image/")) {
            return (
                <Image
                    src={src ? `https://lh3.googleusercontent.com/d/${src}=s400` : "/assets/animat 404.gif"}
                    alt={alt || "Mota"}
                    width={width}
                    height={height}
                    className={`object-cover ${style}`}
                    priority
                />
            );
        } else if (mimetype === "application/pdf") {
            return (
                <embed
                    src={`https://drive.google.com/file/d/${src}/preview`}
                    width="100%"
                    height="100%"
                    type="application/pdf"
                />
            );
        }
        else if (mimetype.startsWith("video/")) {
            return (
                <iframe
                    src={`https://drive.google.com/file/d/${src}/preview`} // ✅ Fix: Use /preview
                    allow="autoplay"
                    className="w-full h-full rounded-lg"
                />
            );
        }
        else if (
            mimetype === "application/zip" ||
            mimetype === "application/x-zip-compressed"
        ) {
            return (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <FileArchive className="w-24 h-24 text-gray-400" />
                </div>
            );
        }
        return null;
    };
    return (
        <div className="relative w-full h-full">
            {renderPreview()}
        </div>
    )
}
