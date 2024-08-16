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
    type Manufacturers
 } from "@/components/filters";
import Supabase from "@/db/config";
import allMolds from "@/public/molds";
import SheetFilter from "@/components/sheetFilter";
import Sort from "@/components/sort";
import { useFilters } from "@/lib/utils";

export default function Results() {
    const [resultsCount, setResultsCount] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(true);
    const { query, typeFilter, manufacturerFilter, moldFilter} = useFilters();

    const molds = useMemo(() => {
        const result: string[] = [];
        manufacturerFilter.forEach(m => {
          if (m in allMolds) {
            result.push(...allMolds[m as keyof typeof allMolds]);
          }
        });
        return result;
    }, [manufacturerFilter]);

    console.log("results count", resultsCount);
    
    useEffect(() => {
        const fetchResultsCount = async () => {
            if (!Supabase) return;
            const { data } = await Supabase.rpc("disc_search_results_count", {
                query: query,
                manufacturer_filter: manufacturerFilter,
                model_filter: moldFilter,
                type_filter: typeFilter
            })
            console.log(data)
            setResultsCount(data || 0);
            
        }
        fetchResultsCount();
    },[moldFilter, manufacturerFilter, typeFilter, query, setResultsCount]);

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
            <main className="flex min-h-screen flex-col items-center justify-between my-12">
                <InputForm />
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
