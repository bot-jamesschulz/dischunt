'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowDownWideNarrow } from 'lucide-react'

export type SortMethod = 'Relevance' | 'Highest Price' | 'Lowest Price' 
export const defaultSort = 'Relevance';

export default function Sort({ 
    className
}: { className?: string}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currSearch = new URLSearchParams(searchParams);
    
    const valueChangeHandler = (selection: SortMethod) => {
        
        currSearch.set('page', '1')
        currSearch.set('sort', selection)
    
        router.push(`/results?${currSearch.toString()}`)
    }

    return (
        <div className={`${className} flex justify-center items-center gap-2`}>
            <Select onValueChange={valueChangeHandler}>
                <SelectTrigger className='border-none text-base text-left max-w-52 min-w-[95px]'>
                    <ArrowDownWideNarrow strokeWidth={1.75} size={20} className='min-w-5 mr-1'/>
                    <SelectValue placeholder={<span>Sort By <span className='font-semibold'>{searchParams.get('sort') || defaultSort}</span></span>} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Relevance">Relevance</SelectItem>
                    <SelectItem value="Lowest Price">Lowest Price</SelectItem>
                    <SelectItem value="Highest Price">Highest Price</SelectItem>  
                </SelectContent>
            </Select>
        </div>
    )
}