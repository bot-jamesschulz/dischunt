"use client"

import { useSearchParams } from "next/navigation";
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
import manufacturers from "@/public/manufacturers";

export default function Results() {
    const [resultsCount, setResultsCount] = useState(0);
    const searchParams = useSearchParams();
    const currSearch = new URLSearchParams(searchParams);
    const manufacturerFilter= currSearch.getAll("manufacturer");
    const moldFilter= currSearch.getAll("mold");
    const query= currSearch.get("query") || "";

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
            console.log('query', query, manufacturers)
            const { data } = await Supabase.rpc("disc_search_results_count", {
                query: query,
                manufacturer_filter: manufacturerFilter,
                model_filter: moldFilter
            })
            console.log(data)
            setResultsCount(data || 0);
            
        }
        fetchResultsCount();
    },[moldFilter, manufacturerFilter, query, setResultsCount]);

    return (
        <Suspense>
            <main className="flex min-h-screen flex-col items-center justify-between pt-12">
                <InputForm />
                <div className="flex m-12 gap-12">
                    <Filters />
                    <Listings />
                </div>
                <Paginate 
                    resultsCount={resultsCount}
                />
            </main>
        </Suspense>
    );
}
