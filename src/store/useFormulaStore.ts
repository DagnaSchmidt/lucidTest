import { create } from "zustand";

interface FormulaState {
    formula: string[];
    setFormula: (newFormula: string[]) => void;
};

export const useFormulaStore = create<FormulaState>((set) => ({
    formula: [],
    setFormula: (newFormula) => set({ formula: newFormula }),
}));
