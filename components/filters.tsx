"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import manufacturers from "@/public/manufacturers";
import allMolds from "@/public/molds";

export type Manufacturers = keyof typeof allMolds;

export function Filters() {
    const router = useRouter();
    const resultsPage = '/results';
    const searchParams = useSearchParams();
    const currSearch = new URLSearchParams(searchParams);
    const manufacturerFilter= currSearch.getAll("manufacturer");
    const moldFilter= currSearch.getAll("mold");
    const query= currSearch.get("query") || "";
    const molds: string[] = [];
    manufacturerFilter.forEach(m => {
        if (m in allMolds) molds.push(...allMolds[m as Manufacturers]); 
    });
    molds.sort();

    

    const handleMakeChange = (option: string) => {  
        if (manufacturerFilter.includes(option)) { // Uncheck
            currSearch.delete("manufacturer");
            const newManufacturerFilter = manufacturerFilter.filter(brand => brand !== option);
            newManufacturerFilter.forEach(brand => {
                currSearch.append("manufacturer", brand);
            });

            // Delete corresponding molds, and re-create mold params
            const newMoldFilter: string[] = [];
            newManufacturerFilter.forEach(m => {
                if (m in allMolds) newMoldFilter.push(...allMolds[m as Manufacturers]); 
            });

            currSearch.delete('mold');
            moldFilter.forEach(mold => {
                if (newMoldFilter.includes(mold)) {
                    console.log('appending')
                    currSearch.append('mold', mold)
                }
            })
        } else { // Check
            currSearch.append('manufacturer', option);
        }
    
        currSearch.set('page', '1');
        router.push(`${resultsPage}?${currSearch.toString()}`);
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
        router.push(`${resultsPage}?${currSearch.toString()}`);
    }

    return (
        <div className="w-full max-w-96 min-w-56">
            <Accordion type="single" collapsible>
                <AccordionItem value="brands">
                    <AccordionTrigger>Brands</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                        {manufacturers.map(option => (
                            <div key={option} className="flex gap-2">
                                <Checkbox 
                                    id={`Brand:${option}`}
                                    value={option}
                                    checked={manufacturerFilter.includes(option)}
                                    onCheckedChange={() => handleMakeChange(option)}
                                />
                                <label 
                                    htmlFor={`Brand:${option}`}
                                    className="hover:cursor-pointer"
                                >
                                    {option}
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
                        {molds.map(option => (
                            <div key={option} className="flex gap-2">
                                <Checkbox 
                                    id={`Mold:${option}`}
                                    value={option}
                                    checked={moldFilter.includes(option)}
                                    onCheckedChange={() => handleMoldChange(option)}
                                />
                                <label 
                                    htmlFor={`Mold:${option}`}
                                    className="hover:cursor-pointer"
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}