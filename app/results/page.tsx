"use client"

import Listings from '@/components/listings';
import { InputForm } from '@/components/ui/input-form';
import { 
    Suspense,
    useState,
    useEffect,
    useMemo
} from "react";
import Paginate from "@/components/pagination";
import { 
    Filters,
    type Brands
 } from "@/components/filters";
import Supabase from "@/db/config";
import allMolds from "@/public/molds";
import SheetFilter from "@/components/sheetFilter";
import Sort from "@/components/sort";
import { useFilters } from "@/lib/utils";
import { Slider } from "@/components/ui/slider"

export default function Results() {
    const [resultsCount, setResultsCount] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(true);
    const { query, typeFilter, brandFilter, moldFilter, speedFilter, glideFilter, turnFilter, fadeFilter } = useFilters();

    const molds = useMemo(() => {
        const result: string[] = [];
        brandFilter.forEach(m => {
          if (m in allMolds) {
            result.push(...allMolds[m as keyof typeof allMolds]);
          }
        });
        return result;
    }, [brandFilter]);
    
    useEffect(() => {
        const fetchResultsCount = async () => {
            if (!Supabase) return;
            const { data } = await Supabase.rpc("disc_search_results_count", {
                query: query,
                brand_filter: brandFilter,
                mold_filter: moldFilter,
                type_filter: typeFilter,
                speed_filter: speedFilter,
                glide_filter: glideFilter,
                turn_filter: turnFilter,
                fade_filter: fadeFilter
            })
            setResultsCount(data || 0);
            
        }
        fetchResultsCount();
    },[moldFilter, brandFilter, typeFilter, speedFilter, glideFilter, turnFilter, fadeFilter, query, setResultsCount]);

    // Watch window size to know when to render filter positions
    useEffect(() => {
        const handleResize = () => {
          setIsLargeScreen(window.innerWidth >= 1280);
        };
    
        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return (
        <Suspense>
            <main className="flex min-h-screen flex-col w-full items-center justify-between my-12 max-w-[1700px]">
                <InputForm className="w-1/2"/>
                {isLargeScreen ? 
                    <Sort className='self-end mr-16'/> :
                    <div className='flex justify-center w-3/4 mx-auto'><SheetFilter className='grow basis-0'/><Sort className='grow basis-0'/></div>
                }
                
                <div className="flex m-12 gap-12 justify-center w-11/12">
                    {isLargeScreen && <Filters />}
                    <Listings />
                </div>
                <Paginate 
                    resultsCount={resultsCount}
                />
            </main>
        </Suspense>
    );
}
