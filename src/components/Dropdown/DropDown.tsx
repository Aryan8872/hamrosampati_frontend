import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

interface DropdownProps<T = string> {
    options: T[];
    value: T;
    onChange: (name: string, value: T) => void; // 👈 Change this line
    placeholder?: string;
    icon?: ReactNode;
    className?: string;
    setValuefn: Dispatch<SetStateAction<T >>,
    displayValue?: (value: T) => string;
    searchable?: boolean;
}

export const Dropdown = <T extends string>({
    options,
    value,
    setValuefn,
    placeholder = 'Select an option',
    icon,
    className = '',
    displayValue,
    searchable = true,
}: DropdownProps<T>) => {
    const [query, setQuery] = useState('');
    console.log(query)

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) => {
                return option.toLowerCase().includes(query.toLowerCase());
            });

    return (
        <Combobox value={value} onChange={(e) => setValuefn(e!)}>
            <div className={`relative ${className}`}>
                <div className="relative flex items-center">
                    {icon && <div className="absolute left-3 text-gray-500">{icon}</div>}
                    <ComboboxInput
                        displayValue={displayValue ? displayValue : (value: T) => value || placeholder}
                        onChange={(event) => searchable && setQuery(event.target.value)}
                        className={`w-full rounded-lg border border-gray-300 bg-white py-2 pl-${icon ? '10' : '3'} pr-10 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <FiChevronDown className="h-4 w-4 text-gray-500" />
                    </ComboboxButton>
                </div>
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredOptions.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found
                        </div>
                    ) : (
                        filteredOptions.map((option, idx) => (
                            <ComboboxOption
                                key={idx}
                                value={option}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {option}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                <FiCheck className="h-5 w-5" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    );
};