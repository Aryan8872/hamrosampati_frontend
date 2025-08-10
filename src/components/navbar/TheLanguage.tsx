import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Select, { components, DropdownIndicatorProps, GroupBase, StylesConfig } from "react-select";

interface LanguageOption {
    value: string;
    label: string;
}

const TheLanguage = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>({
        value: "English",
        label: "English",
    });

    const handleChange = (selectedOption: LanguageOption | null) => {
        setSelectedLanguage(selectedOption);
    };

    const DropdownIndicator = (props: DropdownIndicatorProps<LanguageOption, false, GroupBase<LanguageOption>>) => {
        const { selectProps } = props;
        const isOpen = selectProps.menuIsOpen;

        return (
            <components.DropdownIndicator {...props}>
                <span
                    className={`transform transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <MdOutlineKeyboardArrowDown size={20} />
                </span>
            </components.DropdownIndicator>
        );
    };

    const customStyles: StylesConfig<LanguageOption, false, GroupBase<LanguageOption>> = {
        control: (base) => ({
            ...base,
            border: "none",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            padding: "0",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: "0",
            marginLeft: "-1.2rem",
        }),
        singleValue: (base) => ({
            ...base,
            width: '70px',
            overflow: "visible",
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        menu: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
            minWidth: "140%",
            right: '-14px'
        }),
    };

    return (
        <div className="text-center relative">
            <Select<LanguageOption, false, GroupBase<LanguageOption>>
                options={[
                    { value: "English", label: "English" },
                    { value: "Nepali", label: "Nepali" },
                    { value: "Japanese", label: "Japanese" },
                ]}
                onChange={handleChange}
                value={selectedLanguage}
                styles={customStyles}
                placeholder="Select Language"
                components={{ DropdownIndicator }}
            />
        </div>
    );
};

export default TheLanguage;
