"use client"

import Supabase from "@/db/config";
import { 
    type ManufacturerCounts,
    type ModelCounts,
    type TypeCounts
} from '@/db/types';
import { 
    useRouter, 
    useSearchParams 
} from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import FilterTags from "@/components/filterTags";
import allMolds from "@/public/molds";
import { 
    useEffect,
    useState
} from "react";
import { useFilters } from "@/lib/utils";

export type Manufacturers = keyof typeof allMolds;

export function Filters() {
    const [manufacturerCounts, setManufacturerCounts] = useState<ManufacturerCounts>([]);
    const [moldCounts, setMoldCounts] = useState<ModelCounts>([]);
    const [typeCounts, setTypeCounts] = useState<TypeCounts>([]);
    const router = useRouter();
    const resultsPage = '/results';
    const searchParams = useSearchParams();
    const currSearch = new URLSearchParams(searchParams);
    const { query, typeFilter, manufacturerFilter, moldFilter} = useFilters();
    const molds: string[] = [];
    manufacturerFilter.forEach(m => {
        if (m in allMolds) molds.push(...allMolds[m as Manufacturers]); 
    });
    molds.sort();

    // Manufacturer counts
    useEffect(() => {
        const fetchCounts = async () => {
            if (!Supabase) return;

            const { data } = await Supabase.rpc("get_manufacturer_counts", {
                query: query,
                type_filter: typeFilter
            })

            setManufacturerCounts(data || []); 
        }
        fetchCounts();
    }, [query, typeFilter]);

    // Mold counts
    useEffect(() => {
        const fetchCounts = async () => {
            if (!Supabase) return;

            const { data } = await Supabase.rpc("get_model_counts", {
                query: query,
                manufacturer_filter: manufacturerFilter,
                type_filter: typeFilter
            })

            setMoldCounts(data || []); 
        }
        fetchCounts();
    }, [manufacturerFilter, typeFilter, query]);

    // Type counts
    useEffect(() => {
        const fetchCounts = async () => {
            if (!Supabase) return;

            const { data } = await Supabase.rpc("get_type_counts", {
                query: query,
                manufacturer_filter: manufacturerFilter,
                model_filter: moldFilter
            })

            setTypeCounts(data || []); 
        }
        fetchCounts();
    }, [manufacturerFilter, moldFilter , query]);

    const handleTypeChange = (option: string) => {
        if (typeFilter.includes(option)) { // Uncheck
            currSearch.delete("type");
            const newFilter = typeFilter.filter(type => type !== option);
            newFilter.forEach(type => {
                currSearch.append("type", type);
            })

        } else { // Check
            currSearch.append("type", option);
        }
    
        currSearch.set("page", "1");
        router.push(`${resultsPage}?${currSearch.toString()}`, { scroll: false });
    }

    const handleManufacturerChange = (option: string) => {  
        if (manufacturerFilter.includes(option)) { // Uncheck
            currSearch.delete("manufacturer");
            const newManufacturerFilter = manufacturerFilter.filter(brand => brand !== option);
            newManufacturerFilter.forEach(brand => {
                currSearch.append("manufacturer", brand);
            });

            // Delete corresponding molds, and re-create mold params
            const newMoldFilter: string[] = [];
            newManufacturerFilter.forEach(m => {
                // Push the molds of the selected manufacturers
                if (m in allMolds) newMoldFilter.push(...allMolds[m as Manufacturers]); 
            });

            // Delete old molds
            currSearch.delete('mold');
            // Only add back the molds that are in the new mold filter
            moldFilter.forEach(mold => {
                if (newMoldFilter.includes(mold)) {
                    currSearch.append('mold', mold)
                }
            })
        } else { // Check
            currSearch.append('manufacturer', option);
        }
    
        currSearch.set('page', '1');
        router.push(`${resultsPage}?${currSearch.toString()}`, { scroll: false });
    }

    const handleMoldChange = (option: string) => {
        if (moldFilter.includes(option)) { // Uncheck
            currSearch.delete("mold");
            const newFilter = moldFilter.filter(mold => mold !== option);
            newFilter.forEach(mold => {
                currSearch.append("mold", mold);
            })
        } else { // Check
            currSearch.append("mold", option);
        }
    
        currSearch.set("page", "1");
        router.push(`${resultsPage}?${currSearch.toString()}`, { scroll: false });
    }

    return (
        <div className="w-full max-w-96 min-w-56">
            <FilterTags />
            <Accordion type="single" collapsible>
                <AccordionItem value="Disc type">
                    <AccordionTrigger>Disc type</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {typeCounts.map(({type, count }) => (
                            <div key={type} className="flex gap-2">
                                <Checkbox 
                                    id={`Type:${type}`}
                                    value={type}
                                    checked={typeFilter.includes(type)}
                                    onCheckedChange={() => handleTypeChange(type)}
                                />
                                <label 
                                    htmlFor={`Type:${type}`}
                                    className="hover:cursor-pointer"
                                >
                                    {type} ({count})
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible>
                <AccordionItem value="brands">
                    <AccordionTrigger>Brands</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {manufacturerCounts.map(({manufacturer, count }) => (
                            <div key={manufacturer} className="flex gap-2">
                                <Checkbox 
                                    id={`Brand:${manufacturer}`}
                                    value={manufacturer}
                                    checked={manufacturerFilter.includes(manufacturer)}
                                    onCheckedChange={() => handleManufacturerChange(manufacturer)}
                                />
                                <label 
                                    htmlFor={`Brand:${manufacturer}`}
                                    className="hover:cursor-pointer"
                                >
                                    {manufacturer} ({count})
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className={`${manufacturerFilter.length ? "" : "opacity-50 pointer-events-none"}`}>
                <AccordionItem value="molds">
                    <AccordionTrigger>Molds</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2 h-96 overflow-auto">
                        {moldCounts.map(({ model, count}) => (
                            <div key={model} className="flex gap-2">
                                <Checkbox 
                                    id={`Mold:${model}`}
                                    value={model}
                                    checked={moldFilter.includes(model)}
                                    onCheckedChange={() => handleMoldChange(model)}
                                />
                                <label 
                                    htmlFor={`Mold:${model}`}
                                    className="hover:cursor-pointer"
                                >
                                    {model} ({count})
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}