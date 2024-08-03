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
            const page = searchParams.get("page");
            
            setLoadingState('loading')

            const { data, error } = await Supabase.rpc("disc_search", {
                query: query,
                manufacturer_filter: manufacturers,
                model_filter: molds,
                page: Number(page)
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
            }
        }

        fetchListings();
    }, [searchParams]);
    
    return (
        <div className="flex min-h-screen flex-col items-center justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 border rounded-md sm:p-10">
                {listings.map((listingData) => <Listing key={listingData.details_url} discListing={listingData} />)}
            </div>
        </div>
    );
}