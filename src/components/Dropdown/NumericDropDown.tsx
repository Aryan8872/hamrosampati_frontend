import { Dispatch, ReactNode, SetStateAction } from "react";
import { Dropdown } from "./DropDown";

interface NumericDropdownProps {
  min: number;
  max: number;
  value: string;
  onChange: (name: string, value: string) => void; // 👈 UPDATE THIS
  placeholder?: string;
  icon?: ReactNode;
  setValuefn:Dispatch<SetStateAction<string>>
  className?: string;
}

export const NumericDropdown = ({
  min,
  max,
  value,
  onChange,
  setValuefn,
  placeholder = 'Select',
  icon,
  className = '',
}: NumericDropdownProps) => {
  const options = Array.from({ length: max - min + 1 }, (_, i) => (min + i).toString());
  
  return (
    <Dropdown
      options={options}
      setValuefn={setValuefn}
      value={value}
      onChange={(name,val)=>onChange(name,val)}
      placeholder={placeholder}
      icon={icon}
      className={className}
    />
  );
};