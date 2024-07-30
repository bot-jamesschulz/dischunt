"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Listing from "@/components/ui/listing";
import Supabase from "@/db/config";
import { type DiscSearch } from '@/db/types';

export default function Results() {
    const [listings, setListings] = useState<DiscSearch>([]);
    const [loadingState, setLoadingState] = useState<undefined | 'loading' | 'loaded' | 'no results'>();
    const searchParams = useSearchParams();

    useEffect(() => {
        
        const fetchListings = async () => {
            
            if (!Supabase) return;

            const query = searchParams.get('query') || "";
            console.log('query', query)
            setLoadingState('loading')

            const { data, error } = await Supabase.rpc("disc_search", {
                query: query
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
        <div className="flex min-h-screen flex-col items-center justify-between sm:p-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border sm:p-10 p">
                {listings.map((listingData) => <Listing key={listingData.details_url} discListing={listingData} />)}
            </div>
        </div>
    );
}