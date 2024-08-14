"use client"

import { useSearchParams } from "next/navigation";
import { 
    useEffect, 
    useState
} from "react";
import Listing from "@/components/ui/listing";
import Supabase from "@/db/config";
import { 
    type DiscSearch
} from '@/db/types';
import { defaultSort } from "@/components/sort"

export default function Results() {
    const [listings, setListings] = useState<DiscSearch>([]);
    const [loadingState, setLoadingState] = useState<undefined | 'loading' | 'loaded' | 'no results'>();
    const searchParams = useSearchParams();

    useEffect(() => {
        
        const fetchListings = async () => {
            
            if (!Supabase) return;

            const query = searchParams.get('query') || "";
            const manufacturers = searchParams.getAll("manufacturer");
            const molds = searchParams.getAll("mold");
            const types = searchParams.getAll("type");
            const page = searchParams.get("page");
            const sort = searchParams.get("sort") || defaultSort;
            
            setLoadingState('loading')

            const { data, error } = await Supabase.rpc("disc_search", {
                query: query,
                manufacturer_filter: manufacturers,
                model_filter: molds,
                type_filter: types,
                page: Number(page),
                sort
            })

            if (error) {
                console.error("Error fetching listings", error)
                return
            }

            setLoadingState("loaded");

            if (!data?.length) {
                setLoadingState("no results")
            } else {
                setListings(data)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }

        fetchListings();
    }, [searchParams]);
    
    return (
        <div className="flex min-h-screen flex-col items-center justify-between">
            {loadingState === 'no results' && (
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    No results
                </h2>
            )}
            {(loadingState === 'loaded' || loadingState === 'loading') && (
                <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:gap-8 gap-2 rounded-md sm:p-10 w-full drop-shadow-2xl shadow-lg">
                    {listings.map((listingData) => <Listing key={listingData.details_url} discListing={listingData} />)}
                </div>
            )}
            
        </div>
    );
}