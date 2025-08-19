import { GeneralBtn } from "@/components/buttons/general-btn";
import { Label } from "@/components/ui/label";
import CreateFormFields from "./create-form-fields";
import { DrawerComponent } from "../drawer/drawer-component";
import { customFields } from "@/types/custom-field-types";

interface CustomBtnPreviewProps {
  handleSubmit: () => void;
  fields: customFields[];
  setFields: (fields: customFields[]) => void;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const CustomBtnPreview = ({
  handleSubmit,
  fields,
  setFields,
  isLoading,
  isOpen, setIsOpen
}: CustomBtnPreviewProps) => {

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div>
        <Label htmlFor="customfield">Add new custom field</Label>
        <div className="mt-1">
          <GeneralBtn isIcon={false} title={"Custom field"} submit={() => setIsOpen(true)} />
        </div>
      </div>
      <DrawerComponent
        title=""
        description=""
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <CreateFormFields
          handleSubmit={handleSubmit}
          fields={fields}
          setFields={setFields}
          isLoading={isLoading}
        />
      </DrawerComponent>
    </>
  );
};

export default CustomBtnPreview;
