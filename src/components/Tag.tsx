import React, { useState, useEffect } from "react";
import { useOptionsStore } from "@/store/useOptionsStore";
import { SuggestionProps } from "@/types/inputProps";

const Tag = ({
    category,
    value
}: SuggestionProps) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const { categoryOptions, fetchCategoryOptions } = useOptionsStore();

    const toggleDropdown = () => {
        setIsDropdownVisible((prev) => !prev);
    };

    useEffect(() => {
        if (isDropdownVisible) {
            fetchCategoryOptions(category);
        }
    }, [isDropdownVisible, category, fetchCategoryOptions]);

    const handleSelect = (newValue: string) => {
        value = newValue;
        setIsDropdownVisible(false);
    };

    return (
        <div className="relative inline-block">
            <button
                className="bg-blue-200 px-2 py-1 rounded text-sm text-gray-700 font-semibold flex items-center gap-2 cursor-pointer"
                type="button"
                onClick={toggleDropdown}
            >
                {value}
            </button>

            {isDropdownVisible && categoryOptions.length > 0 && (
                <div className="absolute top-full left-0 bg-white shadow-md p-2 text-sm mt-1 w-full min-w-40 rounded-md">
                    {categoryOptions.map((option) => (
                        <div
                            key={option.id}
                            className="p-2 cursor-pointer hover:bg-blue-100 rounded-md transition"
                            onClick={() => handleSelect(option.value)}
                        >
                            <span className="font-medium">{option.name}: {option.value}</span>
                            <div className="text-sm text-gray-500">{option.category}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tag;
