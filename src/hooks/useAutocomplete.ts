import { useQuery } from "@tanstack/react-query";

const fetchAutocomplete = async (query: string) => {
    const res = await fetch(`/api/autocomplete`);

    if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
    };

    const data = await res.json();

    return data.filter((item: any) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
};

export const useAutocomplete = (inputValue: string) => {
    const lastPart = inputValue.split(" ").pop() || "";
    return useQuery({
        queryKey: ["autocomplete", lastPart],
        queryFn: () => fetchAutocomplete(lastPart),
        enabled: !!lastPart,
    });
};
