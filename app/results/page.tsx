"use client"

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InputForm } from "@/components/ui/input-form";
import Supabase from "@/db/config";
import { type Database } from '@/db/types';

type DiscSearch = Database['public']['Functions']['disc_search']['Returns'];

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
                disc: query
            })

            if (error) {
                console.error("Error fetching listings", error)
                return
            }

            setLoadingState("loaded");

            if (!data?.length) {
                console.log('2')
                setLoadingState("no results")
            } else {
                console.log('3')
                setListings(data)
            }
        }

        fetchListings();
    }, [searchParams]);


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <InputForm/>
            {listings.map(({details_url, listing, img_src, price}) => {
                return (
                    <a href={details_url} rel="external" target="_blank" key={details_url}>
                        <Image src={img_src} alt="" width={300} height={300}/>
                        <div >{listing}: {price}</div>
                    </a>
                )
            })}
        </main>
    );
}
