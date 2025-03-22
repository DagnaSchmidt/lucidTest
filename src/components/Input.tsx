"use client"

import { useState, useEffect, useRef } from "react";
import { useFormulaStore } from "@/store/useFormulaStore";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { SuggestionProps } from "@/types/inputProps";

import Tag from "./Tag";

const Input = () => {
    const { formula, setFormula } = useFormulaStore();
    const [inputValue, setInputValue] = useState("");
    const [displayValue, setDisplayValue] = useState<(string | SuggestionProps)[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const { data: suggestions } = useAutocomplete(inputValue);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const getLastWord = (value: string) => value.split(" ").pop() || "";

    useEffect(() => {
        const lastWord = getLastWord(inputValue);
        setIsDropdownVisible(lastWord.length > 0);
    }, [inputValue]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            setDisplayValue([...displayValue, inputValue.trim()]);
            setFormula([...formula, inputValue.trim()]);
            setInputValue("");
        } else if (e.key === "Backspace" && inputValue === "") {
            if (displayValue.length > 0) {
                const lastItem = displayValue.pop();
                setDisplayValue([...displayValue]);

                if (typeof lastItem === "string") {
                    setInputValue(lastItem);
                }
            }
        }
    };

    const handleAutocompleteClick = (suggestion: SuggestionProps) => {
        const lastWord = getLastWord(inputValue);
        const textBeforeLastWord = inputValue.substring(0, inputValue.lastIndexOf(lastWord)).trim();

        const updatedDisplay = [...displayValue];
        const updatedFormula = [...formula];

        if (textBeforeLastWord) {
            updatedDisplay.push(textBeforeLastWord);
            updatedFormula.push(textBeforeLastWord);
        }

        updatedDisplay.push({
            value: suggestion.value,
            category: suggestion.category,
            name: suggestion.name,
            id: suggestion.id
        });

        const newString = suggestion.value.toString();
        updatedFormula.push(newString);

        setDisplayValue(updatedDisplay);
        setFormula(updatedFormula);
        setInputValue("");

        inputRef.current?.focus();
    };

    return (
        <div className="p-4 w-full max-w-lg">
            <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg has-[:focus-within]:border-blue-500">
                {displayValue.map((item, index) =>
                    typeof item === "string" ? (
                        <span key={index} className="text-gray-700">{item}</span>
                    ) : (
                        <Tag key={index} {...item} />
                    )
                )}

                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="outline-none p-1 flex-1"
                />
            </div>

            {isDropdownVisible && suggestions?.length > 0 && (
                <div className="border p-2 mt-2 bg-white shadow-lg rounded-md">
                    {(suggestions ?? []).map((s: SuggestionProps) => (
                        <div
                            key={s.id}
                            className="p-2 cursor-pointer hover:bg-blue-100 rounded-md transition"
                            onClick={() => handleAutocompleteClick(s)}
                        >
                            <span className="font-medium">{s.name}: {s.value}</span>
                            <div className="text-sm text-gray-500">{s.category}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Input;
