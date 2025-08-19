"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ParsedEmail {
  html: string;
  hasHtml: boolean;
}

interface EmailViewerProps {
  rawEmail: string;
  isShort?:boolean;
}

// Move utility functions outside component to prevent recreation on each render
const extractHtmlFromMultipart = (emailBody: string): string | null => {
  try {
    const match = emailBody.match(
      /Content-Type: text\/html[\s\S]*?(?=(?:--\w+)|$)/i
    );
    if (!match) return null;

    const splitIndex = match[0].indexOf("\r\n\r\n");
    if (splitIndex === -1) return null;

    let htmlContent = match[0].substring(splitIndex).trim();

    if (/Content-Transfer-Encoding:\s*quoted-printable/i.test(match[0])) {
      htmlContent = decodeQuotedPrintable(htmlContent);
    }

    return htmlContent;
  } catch (error) {
    console.error("Error extracting HTML:", error);
    return null;
  }
};

const decodeQuotedPrintable = (input: string): string => {
  if (!input) return "";

  const decoded = input
    .replace(/=\r?\n/g, "") // remove soft line breaks
    .replace(/=([A-Fa-f0-9]{2})/g, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16))
    );

  // Now decode any UTF-8 sequences
  try {
    // Turn into bytes
    const bytes = new Uint8Array([...decoded].map((c) => c.charCodeAt(0)));
    const utf8decoder = new TextDecoder("utf-8");
    return utf8decoder.decode(bytes);
  } catch (error) {
    console.error("UTF-8 decoding error:", error);
    return decoded; // fallback
  }
};

export default function EmailViewer({ rawEmail,isShort=false }: EmailViewerProps) {
  const [email, setEmail] = useState<ParsedEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rawEmail) {
      setLoading(false);
      return;
    }

    const parseEmail = async () => {
      try {
        const htmlContent = extractHtmlFromMultipart(rawEmail);

        if (!htmlContent) {
          throw new Error("No HTML content found");
        }

        setEmail({
          html: htmlContent,
          hasHtml: true,
        });
        setError(null);
      } catch (err) {
        console.error("Error parsing email:", err);
        setError("Failed to parse email content");
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    parseEmail();
  }, [rawEmail]); // Simplified dependency array

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Parsing email content...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!email) {
    return <div className="p-4 text-center">No email content available</div>;
  }

  return (
    <div className="email-container space-y-4">
      {email.hasHtml ? (
        <div
          className="email-content prose prose-sm max-w-none dark:prose-invert overflow-auto"
          dangerouslySetInnerHTML={{ __html: isShort?`${email.html.substring(0, 100)}...`:email.html }}
        />
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No HTML content available
        </div>
      )}
    </div>
  );
}
