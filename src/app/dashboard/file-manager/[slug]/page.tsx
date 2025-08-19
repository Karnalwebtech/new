import AllFiles from "@/modules/dashboard/file-manager/all/all-files";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface SlugPageProps {
  params: {
    slug: string;
  };
}

// Define valid slugs and corresponding titles dynamically
const metaTitles: Record<string, string> = {
  all: "All Files",
  video: "Video Files",
  image: "Image Files",
  document: "Document Files",
  archive: "Archive Files",
};

// **Dynamically generate metadata**
export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!metaTitles[slug]) {
    notFound();
  }

  return {
    title: metaTitles[slug] || "File Manager",
    description: `Browse ${metaTitles[slug]} in the file manager.`,
  };
}

export default async function FileManager({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!metaTitles[slug]) {
    notFound();
  }

  return <AllFiles pageid={slug} />;
}
