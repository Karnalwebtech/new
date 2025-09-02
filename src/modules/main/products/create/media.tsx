"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

import { close } from "@/reducers/healper-slice";
import { File, removeFile } from "@/reducers/file-slice";

import { DrawerComponent } from "@/components/drawer/drawer-component";
import { FileHandler } from "@/components/files/file-loader/file-handler";
import FileLoader from "@/components/files/file-loader/file-loader";
import LazyImage from "@/components/LazyImage";

import { Label } from "@radix-ui/react-label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Ellipsis,
  X,
  GalleryVerticalEnd,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import { useReorder } from "@/hooks/useReorder";

const Media = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state?.helper?.isOpen);
  const filesDataFromStore = useSelector(
    (state: RootState) => state.files.files
  );

  /* keep only images and mirror them to local state for ordering */
  const onlyImages = (filesDataFromStore || []).filter(
    (f) => f.category === "image"
  );

  const [ordered, setOrdered] = useState<File[]>(onlyImages); // local order
  const [isThumbnail, setIsThumbnail] = useState<string>(""); // stores public_id

  const {
    onDragStart,
    onDragOver,
    onDrop,
    moveUp,
    moveDown,
    moveTop,
    moveBottom,
  } = useReorder(setOrdered);
  // keep local order in sync when redux changes (add/remove)
  useEffect(() => {
    // preserve previous order when possible
    const map = new Map(ordered.map((x) => [x._id, x]));
    const next = onlyImages.map((x) => map.get(x._id) ?? x);
    setOrdered(next);
  }, [filesDataFromStore]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => dispatch(close());

  const removeHandler = useCallback(
    (id: string) => {
      // if the removed is the current thumbnail -> clear
      const item = ordered.find((x) => x._id === id);
      if (item && item.public_id === isThumbnail) setIsThumbnail("");
      // update local order immediately for snappy UI
      setOrdered((prev) => prev.filter((x) => x._id !== id));
      // update store
      dispatch(removeFile(id));
    },
    [dispatch, ordered, isThumbnail]
  );

  /* You can expose `ordered` to parent/store on save if needed */

  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-500">
          Media <span className="text-gray-400">Optional</span>
        </Label>

        <FileHandler
          title={"Thumbnail"}
          typeId={"thumbnail"}
          maxLimit={10}
          category={"image"}
          isgallery={false}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {ordered.length > 0 &&
          ordered.map((item, i) => (
            <div
              key={item._id} // stable key
              className="bg-gray-100 p-3 rounded-lg shadow-md grid grid-cols-12 gap-4 group"
              draggable
              onDragStart={onDragStart(i)}
              onDragOver={onDragOver}
              onDrop={onDrop(i)}
            >
              <div className="col-span-1 flex items-center">
                <GripVertical className="mr-2 opacity-60 group-hover:opacity-100 cursor-grab" />
                <LazyImage
                  src={item?.public_id || ""}
                  alt="Gallery Image"
                  width={500}
                  height={500}
                  mimetype={item?.mimetype ? item?.mimetype : "image/"}
                  style="w-14 max-h-12 object-cover rounded-lg"
                />
              </div>

              <div className="col-span-7">
                <p className="text-sm font-medium text-gray-800">
                  {item?.title}
                </p>

                {isThumbnail === item.public_id && (
                  <span className="text-xs inline-block mt-[2px] p-[4px] bg-blue-800 rounded-full">
                    <GalleryVerticalEnd
                      className="-rotate-90 text-green-200"
                      size={14}
                    />
                  </span>
                )}
              </div>

              {/* optional quick reorder buttons (desktop) */}
              <div className="col-span-2 hidden md:flex items-center justify-center gap-2">
                <button onClick={() => moveTop(item._id)} title="Move to Top">
                  <ChevronsUp size={16} />
                </button>
                <button onClick={() => moveUp(item._id)} title="Move Up">
                  <ArrowUp size={16} />
                </button>
                <button onClick={() => moveDown(item._id)} title="Move Down">
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => moveBottom(item._id)}
                  title="Move to Bottom"
                >
                  <ChevronsDown size={16} />
                </button>
              </div>

              <div className="col-span-2 flex gap-4 items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis size={16} className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => setIsThumbnail(item.public_id)}
                    >
                      <GalleryVerticalEnd className="-rotate-90" size={16} />
                      Make Thumbnail
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="h-px bg-gray-300 my-1" />
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => removeHandler(item._id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <X
                  size={16}
                  className="cursor-pointer"
                  onClick={() => removeHandler(item._id)}
                />
              </div>
            </div>
          ))}
      </div>

      <DrawerComponent
        title=""
        description=""
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <FileLoader />
      </DrawerComponent>
    </>
  );
};

export default memo(Media);
