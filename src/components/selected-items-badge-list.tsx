import React, { useCallback } from "react";
import ButtonEvent from "./buttons/btn-event";
import { useDispatch } from "react-redux";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { RootState, useAppSelector } from "@/store";
import { clearSelected, toggleCode } from "@/reducers/healper-slice";

const SelectedItemsBadgeList = () => {
  const { selected } = useAppSelector((state: RootState) => state.helper);
  const dispatch = useDispatch();
  const handleRemove = useCallback(
    (id: string) => {
      dispatch(
        toggleCode({
          code: id, // ✅ single string
          checked: false,
        })
      );
    },
    [dispatch]
  );
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mt-4">
        {/* Selected countries badges */}
        <div className="flex flex-wrap gap-2">
          {selected?.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
            >
              <span className="truncate max-w-[100px]">{item}</span>
              <Button
                onClick={() => handleRemove(item)} // ✅ add remove logic
                className="p-0 h-6 w-6 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-300 hover:text-gray-900 transition"
              >
                <X size={14} />
              </Button>
            </Badge>
          ))}
          {selected?.length > 0 && (
            <ButtonEvent
              title="Clear all"
              event={() => dispatch(clearSelected())}
              style="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow px-4 py-2 transition"
            />
          )}
        </div>
      </div>
      <hr className="border-gray-500 mt-2 dark:border-white"></hr>
    </div>
  );
};

export default SelectedItemsBadgeList;
