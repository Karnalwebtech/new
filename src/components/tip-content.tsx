import React from "react";
interface TipContentProps {
  content: string;
}
const TipContent = ({ content }: TipContentProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* tip icon */}
          <span
            className="inline-flex items-center justify-center w-[5px] h-12 rounded-md bg-gray-500 text-indigo-600 shrink-0"
            aria-hidden
          ></span>

          {/* Tip content */}
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Tip:</span> {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipContent;
