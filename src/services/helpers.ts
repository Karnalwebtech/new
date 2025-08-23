export const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove symbols
    .replace(/[\s_-]+/g, "-") // collapse whitespace and dashes
    .replace(/^-+|-+$/g, ""); // trim - from start and end

// export const formatFileSize = (megabytes: number): string => {
//   const units = ['MB', 'GB', 'TB', 'PB']; // Adjusted for MB input
//   let index = 0;

//   while (megabytes >= 1024 && index < units.length - 1) {
//     megabytes /= 1024;
//     index++;
//   }

//   return `${megabytes.toFixed(2)} ${units[index]}`;
// };

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const calculatePercentage = (used: number, total: number): number => {
  const usedNum = Math.floor(used);  // Corrected: Removed second argument
  const totalNum = Math.floor(total);

  if (totalNum === 0) return 0; // Prevent division by zero
  return (usedNum / totalNum) * 100;
};

export const extractNumber = (size: string, traget: string): number => {
  return parseFloat(size.replace(traget, ""));
};

export const convertToGB = (size: string): number => {
  const units: Record<string, number> = {
    "Bytes": 1 / (1024 ** 3),  // Convert Bytes to GB
    "KB": 1 / (1024 ** 2),     // Convert KB to GB
    "MB": 1 / 1024,            // Convert MB to GB
    "GB": 1,                   // GB remains the same
    "TB": 1024,                // Convert TB to GB
  };

  // Extract numeric value and unit (e.g., "12.97 GB" → ["12.97", "GB"])
  const match = size.match(/([\d.]+)\s*([A-Za-z]+)/);
  if (!match) return 0;

  const [_, numStr, unit] = match;
  const num = parseFloat(numStr);

  return num * (units[unit] || 1); // Convert to GB
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${size} ${units[i]}`;
};

export const formatDate = (dateString: string, month: "numeric" | "2-digit" | "long" | "short" = "short", includeTime: boolean = false): string => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    // Base date options
    const options: Intl.DateTimeFormatOptions = {
      month,
      day: "numeric",
      year: "numeric",
    };

    // Add time properties only if `includeTime` is true
    if (includeTime) {
      Object.assign(options, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return date.toLocaleString("en-US", options);
  } catch {
    return "Invalid Date";
  }
}
export const getsampleFileExtension = (mimetype: string) => {
  return mimetype.split("/")[1]?.toUpperCase() || "UNKNOWN"
}
// Format sampleFile size to KB/MB
export const formatsampleFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true; // Copy success
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false; // Copy failed
  }
};
export default function idToUrl(data: { public_id: string, mimetype: string }): string {
  return data.mimetype.startsWith("image/")
    ? `https://lh3.googleusercontent.com/d/${data.public_id}=s400`
    : `https://drive.google.com/file/d/${data.public_id}/preview`;
}
export const idToImageTag = (data: { public_id: string; mimetype: string;altText: string }) => {

  const encodedUrl = encodeURIComponent(idToUrl(data));
  return `<img
      alt="${data?.altText}"
      width="400"
      height="1000"
      decoding="async"
      data-nimg="1"
      class="object-cover w-[400px] h-full"
      srcset="
        /_next/image?url=${encodedUrl}&w=640&q=75 640w, 
        /_next/image?url=${encodedUrl}&w=1080&q=75 1080w,
        /_next/image?url=${encodedUrl}&w=1920&q=75 1920w
      "
      sizes="(max-width: 400px) 100vw, 400px"
      src="/_next/image?url=${encodedUrl}&w=1920&q=75"
      style="color: transparent;"
    >
  `;
};

export const idToDownloadUrl = (data: { public_id: string, mimetype: string }): string => {
  return data.mimetype.startsWith("image/")
    ? `https://lh3.googleusercontent.com/d/${data.public_id}=s0`
    : `https://drive.google.com/uc?export=download&id=${data.public_id}`;
}
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff)
    .toString(16)
    .toUpperCase()
    .padStart(6, "0");
  return `#${c}`;
};

export const platformColors = {
  facebook: "bg-[#1877F2] text-white",
  twitter: "bg-[#1DA1F2] text-white",
  linkedin: "bg-[#0A66C2] text-white",
  whatsapp: "bg-[#25D366] text-white",
  reddit: "bg-[#FF4500] text-white",
  email: "bg-[#D44638] text-white",
  site: "bg-[#6B7280] text-white",
};
export function formatOperationsPerDay(operations: number): string {
  if (operations >= 1_000_000_000) return `${(operations / 1_000_000_000).toFixed(1)}B/day`;
  if (operations >= 1_000_000) return `${(operations / 1_000_000).toFixed(1)}M/day`;
  if (operations >= 1_000) return `${(operations / 1_000).toFixed(1)}K/day`;
  return `${operations}/day`;
}
function parseTTL(ttl: string): number | null {
  if (ttl === 'No expiry') return null;
  return parseInt(ttl.replace(/s$/, ""), 10);
}

export function formatTTL(secondsStr: string): string {
  const seconds = parseTTL(secondsStr);

  if (seconds === null) return 'No expiry';

  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const result: string[] = [];
  if (days) result.push(`${days}d`);
  if (hours) result.push(`${hours}h`);
  if (minutes) result.push(`${minutes}m`);
  if (secs) result.push(`${secs}s`);

  return result.join(' ') || '0s';
}
