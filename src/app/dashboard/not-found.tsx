import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
export const metadata:Metadata={
  title:"Page not found",
  description:"Page not found"
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex max-w-[64rem] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-2">
          <div className="relative mx-auto mb-4 h-60 w-60 text-muted-foreground">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Search className="h-40 w-40" strokeWidth={1} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8rem] font-extrabold tracking-tighter">
                404
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Page Data not found
          </h1>
          <p className="mx-auto max-w-[42rem] text-muted-foreground sm:text-xl">
            Sorry, we couldn&apost find the page you&aposre looking for. The
            page might have been removed or the link might be broken.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        <div className="mt-8">
          <div className="relative">
            <div className="h-[1px] w-full bg-border" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
              OR
            </div>
          </div>
          <div className="mt-8 grid gap-2">
            <p className="text-sm text-muted-foreground">
              Try searching for something else or go back to the homepage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
