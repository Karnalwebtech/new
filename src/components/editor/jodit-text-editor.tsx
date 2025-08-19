"use client";

import type React from "react";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor with no SSR to avoid hydration issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

import type { Jodit } from "jodit";

const copyStringToClipboard = (str: string): void => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const facilityMergeFields: string[] = [
  "FacilityNumber",
  "FacilityName",
  "Address",
  "MapCategory",
  "Latitude",
  "Longitude",
  "ReceivingPlant",
  "TrunkLine",
  "SiteElevation",
];

const inspectionMergeFields: string[] = [
  "InspectionCompleteDate",
  "InspectionEventType",
];

const createOptionGroupElement = (
  mergeFields: string[],
  optionGrouplabel: string
): HTMLOptGroupElement => {
  const optionGroupElement = document.createElement("optgroup");
  optionGroupElement.setAttribute("label", optionGrouplabel);

  for (let index = 0; index < mergeFields.length; index++) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("class", "merge-field-select-option");
    optionElement.setAttribute("value", mergeFields[index]);
    optionElement.textContent = mergeFields[index];
    optionGroupElement.appendChild(optionElement);
  }

  return optionGroupElement;
};

interface CustomButton {
  name: string;
  tooltip: string;
  iconURL: string;
  popup?: (
    editor: Jodit,
    current: Node | false,
    self: object,
    close: () => void
  ) => HTMLElement;
  exec?: (editor: Jodit) => void;
}

const buttons: Array<string | CustomButton> = [
  "undo",
  "redo",
  "|",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "|",
  "superscript",
  "subscript",
  "|",
  "align",
  "|",
  "ul",
  "ol",
  "outdent",
  "indent",
  "|",
  "font",
  "fontsize",
  "brush",
  "paragraph",
  "|",
  "link",
  "table",
  "|",
  "hr",
  "eraser",
  "copyformat",
  "|",
  "fullsize",
  "selectall",
  "print",
  "|",
  "source",
  "|",
  {
    name: "insertMergeField",
    tooltip: "Insert Variable",
    iconURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJyYWNlcyI+PHBhdGggZD0iTTggM0g3YTIgMiAwIDAgMC0yIDJ2NWEyIDIgMCAwIDEtMiAyIDIgMiAwIDAgMSAyIDJ2NWEyIDIgMCAwIDAgMiAyaDEiLz48cGF0aCBkPSJNMTYgM2gxYTIgMiAwIDAgMSAyIDJ2NWEyIDIgMCAwIDAgMiAyIDIgMiAwIDAgMC0yIDJ2NWEyIDIgMCAwIDEtMiAyaC0xIi8+PC9zdmc+",
    popup: (
      editor: Jodit
      // current: Node | false, self: object, close: () => void
    ): HTMLElement => {
      function onSelected(e: Event): void {
        const target = e.target as HTMLSelectElement;
        const mergeField = target.value;
        if (mergeField) {
          console.log(mergeField);
          editor.selection.insertNode(
            editor.create.fromHTML(`{{${mergeField}}}`)
          );
        }
      }

      const divElement = editor.create.div("merge-field-popup");

      const labelElement = document.createElement("label");
      labelElement.setAttribute("class", "merge-field-label");
      labelElement.textContent = "Merge field: ";
      divElement.appendChild(labelElement);

      const selectElement = document.createElement("select");
      selectElement.setAttribute("class", "merge-field-select");
      selectElement.appendChild(
        createOptionGroupElement(facilityMergeFields, "Facility")
      );
      selectElement.appendChild(
        createOptionGroupElement(inspectionMergeFields, "Inspection")
      );
      selectElement.onchange = onSelected;
      divElement.appendChild(selectElement);

      return divElement;
    },
  },
  {
    name: "copyContent",
    tooltip: "Copy HTML to Clipboard",
    iconURL:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsaXBib2FyZC1jb3B5Ij48cGF0aCBkPSJNOSAySDZhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDlhMiAyIDAgMCAwIDItMnYtNSIvPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjQiIHg9IjE2IiB5PSIyIiByeD0iMSIgcnk9IjEiIHRyYW5zZm9ybT0icm90YXRlKDQ1IDE2IDIpIi8+PHBhdGggZD0iTTE1IDEwbDUgNSIvPjwvc3ZnPg==",
    exec: (editor: Jodit): void => {
      const html = editor.value;
      copyStringToClipboard(html);
    },
  },
];

// Update the interface to use the specific string literal types
interface EditorConfig {
  readonly: boolean;
  toolbar: boolean;
  spellcheck: boolean;
  language: string;
  toolbarButtonSize: "small" | "middle" | "tiny" | "xsmall" | "large";
  toolbarAdaptive: boolean;
  showCharsCounter: boolean;
  showWordsCounter: boolean;
  showXPathInStatusbar: boolean;
  askBeforePasteHTML: boolean;
  askBeforePasteFromWord: boolean;
  buttons: Array<string | CustomButton>;
  uploader: {
    insertImageAsBase64URI: boolean;
  };
  width: string;
  height: number;
}

const editorConfig: EditorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "middle", // This now matches the expected type
  toolbarAdaptive: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  buttons: buttons,
  uploader: {
    insertImageAsBase64URI: false,
  },
  width: "100%",
  height: 700,
};

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Jodit_text_editor: React.FC<TextEditorProps> = ({
  value,
  onChange,
}: TextEditorProps) => {
  return (
    <div
      className="editor-content"
      style={{
        maxWidth: editorConfig.width,
        margin: "0 auto",
        border: "1px solid #ccc",
      }}
    >
      {typeof window !== "undefined" && (
        <JoditEditor value={value} config={editorConfig} onChange={onChange} />
      )}
    </div>
  );
};
