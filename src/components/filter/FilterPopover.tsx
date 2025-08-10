import { Popover } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import { ReactNode } from "react";

type FilterPopoverProps = {
  selectedLabel: string;
  children: ReactNode;
};

const FilterPopover = ({ selectedLabel, children }: FilterPopoverProps) => {
  return (
    <Popover className="relative">
      <Popover.Button className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-100 transition-colors">
        <span className="text-gray-700">
          {selectedLabel}
        </span>
        <FiChevronDown className="text-gray-400" />
      </Popover.Button>
      <Popover.Panel className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
        <div className="p-2 space-y-2">{children}</div>
      </Popover.Panel>
    </Popover>
  );
};

export default FilterPopover