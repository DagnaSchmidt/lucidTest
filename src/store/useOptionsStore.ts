import { create } from "zustand";

interface Option {
    id: string;
    name: string;
    category: string;
    value: string;
};

interface OptionsState {
    categoryOptions: Option[];
    setCategoryOptions: (category: string, options: Option[]) => void;
    fetchCategoryOptions: (category: string) => Promise<void>;
};

export const useOptionsStore = create<OptionsState>((set) => ({
    categoryOptions: [],
    setCategoryOptions: (category, options) =>
        set({ categoryOptions: options }),
    fetchCategoryOptions: async (category) => {
        const res = await fetch(`/api/autocomplete`);
        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        };
        const data = await res.json();
        const filteredOptions = data.filter(
            (item: any) => item.category === category
        );
        set({ categoryOptions: filteredOptions });
    },
}));
