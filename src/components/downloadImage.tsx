"use client"
import { Download } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
interface DownloadFileProps {
    publicId: string;
    filename: string;
    variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}
const DownloadFile = ({ publicId, filename, variant = "default", size = "default" }: DownloadFileProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const handleDownload = () => {
        setLoading(true)
        try {
            const link = document.createElement("a")
            link.href = `https://drive.google.com/uc?export=download&id=${publicId}`
            link.setAttribute("download", filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) // Clean up the DOM after download starts
        } catch (error) {
            console.error("Download failed:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            disabled={loading}
            onClick={handleDownload} // ✅ User manually clicks to download
        >
            <Download /> {filename}
        </Button>
    );
};

export default DownloadFile;
