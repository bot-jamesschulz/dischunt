"use client"

import Supabase from "@/db/config";
import { 
    type BrandCounts,
    type MoldCounts,
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
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils"

export type Brands = keyof typeof allMolds;
export type SliderValues = [number, number];

export const maxSpeed = 15.0;
export const minSpeed = 1.0;
export const maxGlide = 7.0;
export const minGlide = 3.0;
export const maxTurn = 0.0;
export const minTurn = -4.5;
export const maxFade = 4.0;
export const minFade = 0.0;

export function Filters() {
    
    const router = useRouter();
    const resultsPage = '/results';
    const searchParams = useSearchParams();
    const currSearch = new URLSearchParams(searchParams);
    const { query, typeFilter, brandFilter, moldFilter, speedFilter, glideFilter, turnFilter, fadeFilter } = useFilters();
    const [brandCounts, setBrandCounts] = useState<BrandCounts>([]);
    const [moldCounts, setMoldCounts] = useState<MoldCounts>([]);
    const [typeCounts, setTypeCounts] = useState<TypeCounts>([]);
    const [speedValues, setSpeedValues] = useState(speedFilter as number[]);
    const [glideValues, setGlideValues] = useState(glideFilter as number[]);
    const [turnValues, setTurnValues] = useState(turnFilter as number[]);
    const [fadeValues, setFadeValues] = useState(fadeFilter as number[]);
    
    
    const molds: string[] = [];
    brandFilter.forEach(m => {
        if (m in allMolds) molds.push(...allMolds[m as Brands]); 
    });
    molds.sort();

    // Brand counts
    useEffect(() => {
        const fetchCounts = async () => {
            if (!Supabase) return;

            const { data } = await Supabase.rpc("get_brand_counts", {
                query: query,
                type_filter: typeFilter,
                speed_filter: speedFilter,
                glide_filter: glideFilter,
                turn_filter: turnFilter,
                fade_filter: fadeFilter
            })

            setBrandCounts(data || []); 
        }
        fetchCounts();
    }, [query, typeFilter, speedFilter, glideFilter, turnFilter, fadeFilter]);

    // Mold counts
    useEffect(() => {
        const fetchCounts = async () => {
            if (!Supabase) return;

            const { data } = await Supabase.rpc("get_mold_counts", {
                query: query,
                brand_filter: brandFilter,
                type_filter: typeFilter,
                speed_filter: speedFilter,
                glide_filter: glideFilter,
                turn_filter: turnFilter,
                fade_filter: fadeFilter
            })

            setMoldCounts(data || []); 
        }
        fetchCounts();
    }, [brandFilter, typeFilter, speedFilter, glideFilter, turnFilter, fadeFilter, query]);

    // Type counts
    useEffect(() => {
        const fetchCounts = async () => {
            if (!Supabase) return;

            const { data } = await Supabase.rpc("get_type_counts", {
                query: query,
                brand_filter: brandFilter,
                mold_filter: moldFilter,
                speed_filter: speedFilter,
                glide_filter: glideFilter,
                turn_filter: turnFilter,
                fade_filter: fadeFilter,
            })

            setTypeCounts(data || []); 
        }
        fetchCounts();
    }, [brandFilter, moldFilter, speedFilter, glideFilter, turnFilter, fadeFilter, query]);

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

    const handleBrandChange = (option: string) => {  
        if (brandFilter.includes(option)) { // Uncheck
            currSearch.delete("brand");
            const newBrandFilter = brandFilter.filter(brand => brand !== option);
            newBrandFilter.forEach(brand => {
                currSearch.append("brand", brand);
            });

            // Delete corresponding molds, and re-create mold params
            const newMoldFilter: string[] = [];
            newBrandFilter.forEach(m => {
                // Push the molds of the selected brands
                if (m in allMolds) newMoldFilter.push(...allMolds[m as Brands]); 
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
            currSearch.append('brand', option);
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

    const handleSpeedChange = (newValues: SliderValues) => {
        currSearch.set("minSpeed", newValues[0].toString());
        currSearch.set("maxSpeed", newValues[1].toString());
        currSearch.set("page", "1");
        router.push(`${resultsPage}?${currSearch.toString()}`, { scroll: false });
    }

    const handleGlideChange = (newValues: any) => {
        currSearch.set("minGlide", newValues[0].toString());
        currSearch.set("maxGlide", newValues[1].toString());
        currSearch.set("page", "1");
        router.push(`${resultsPage}?${currSearch.toString()}`, { scroll: false });
    }

    const handleTurnChange = (newValues: any) => {
        currSearch.set("minTurn", newValues[0].toString());
        currSearch.set("maxTurn", newValues[1].toString());
        currSearch.set("page", "1");
        router.push(`${resultsPage}?${currSearch.toString()}`, { scroll: false });
    }

    const handleFadeChange = (newValues: any) => {
        currSearch.set("minFade", newValues[0].toString());
        currSearch.set("maxFade", newValues[1].toString());
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
                        {brandCounts.map(({brand, count }) => (
                            <div key={brand} className="flex gap-2">
                                <Checkbox 
                                    id={`Brand:${brand}`}
                                    value={brand}
                                    checked={brandFilter.includes(brand)}
                                    onCheckedChange={() => handleBrandChange(brand)}
                                />
                                <label 
                                    htmlFor={`Brand:${brand}`}
                                    className="hover:cursor-pointer"
                                >
                                    {brand} ({count})
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className={`${brandFilter.length ? "" : "opacity-50 pointer-events-none"}`}>
                <AccordionItem value="molds">
                    <AccordionTrigger>Molds</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2 h-96 overflow-auto">
                        {moldCounts.map(({ mold, count}) => (
                            <div key={mold} className="flex gap-2">
                                <Checkbox 
                                    id={`Mold:${mold}`}
                                    value={mold}
                                    checked={moldFilter.includes(mold)}
                                    onCheckedChange={() => handleMoldChange(mold)}
                                />
                                <label 
                                    htmlFor={`Mold:${mold}`}
                                    className="hover:cursor-pointer"
                                >
                                    {mold} ({count})
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="py-4">
                <span className="font-medium">Speed</span>
                <Slider
                    defaultValue={speedFilter}
                    minStepsBetweenThumbs={0}
                    max={maxSpeed}
                    min={minSpeed}
                    step={0.50}
                    onValueCommit={handleSpeedChange}
                    onValueChange={setSpeedValues}
                    onLostPointerCapture={() => {
                        if (
                          speedFilter[0] !== speedValues[0] ||
                          speedFilter[1] !== speedValues[1]
                        ) {
                          handleSpeedChange(speedValues as SliderValues);
                        }
                    }}
                    className="py-4"
                />
                <div className="flex items-center justify-between w-full">
                    {speedFilter.map((_, index) => (
                    <div key={index} className="flex items-center justify-between h-10">
                        <span>{speedFilter[index]}</span>
                    </div>
                    ))}
                </div>
            </div>
            <div className="py-4">
                <span className="font-medium">Glide</span>
                <Slider
                    defaultValue={glideFilter}
                    minStepsBetweenThumbs={0}
                    max={maxGlide}
                    min={minGlide}
                    step={0.50}
                    onValueCommit={handleGlideChange}
                    onValueChange={setGlideValues}
                    onLostPointerCapture={() => {
                        if (
                          glideFilter[0] !== glideValues[0] ||
                          glideFilter[1] !== glideValues[1]
                        ) {
                          handleGlideChange(glideValues as SliderValues);
                        }
                    }}
                    className="py-4"
                />
                <div className="flex items-center justify-between w-full">
                    {glideFilter.map((_, index) => (
                    <div key={index} className="flex items-center justify-between h-10">
                        <span>{glideFilter[index]}</span>
                    </div>
                    ))}
                </div>
            </div>
            <div className="py-4">
                <span className="font-medium">Turn</span>
                <Slider
                    defaultValue={turnFilter}
                    minStepsBetweenThumbs={0}
                    max={maxTurn}
                    min={minTurn}
                    step={0.50}
                    onValueCommit={handleTurnChange}
                    onValueChange={setTurnValues}
                    onLostPointerCapture={() => {
                        if (
                          turnFilter[0] !== turnValues[0] ||
                          turnFilter[1] !== turnValues[1]
                        ) {
                          handleTurnChange(turnValues as SliderValues);
                        }
                    }}
                    className="py-4"
                />
                <div className="flex items-center justify-between w-full">
                    {turnFilter.map((_, index) => (
                    <div key={index} className="flex items-center justify-between h-10">
                        <span>{turnFilter[index]}</span>
                    </div>
                    ))}
                </div>
            </div>
            <div className="py-4">
                <span className="font-medium">Fade</span>
                <Slider
                    defaultValue={fadeFilter}
                    minStepsBetweenThumbs={0}
                    max={maxFade}
                    min={minFade}
                    step={0.50}
                    onValueCommit={handleFadeChange}
                    onValueChange={setFadeValues}
                    onLostPointerCapture={() => {
                        if (
                          fadeFilter[0] !== fadeValues[0] ||
                          fadeFilter[1] !== fadeValues[1]
                        ) {
                          handleFadeChange(fadeValues as SliderValues);
                        }
                    }}
                    className="py-4"
                />
                <div className="flex items-center justify-between w-full">
                    {fadeFilter.map((_, index) => (
                    <div key={index} className="flex items-center justify-between h-10">
                        <span>{fadeFilter[index]}</span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}