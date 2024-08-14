'use client'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal } from 'lucide-react';
import { Filters } from "@/components/filters";

export default function SheetFilter({ 
    className
}: { className?: string}) {
  
    return (
        <Sheet>
            <SheetTrigger className={`flex text-base justify-center items-center gap-2 ${className}`}><SlidersHorizontal size={20}/>Filter</SheetTrigger>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} className='flex flex-col overflow-auto' side='left'>
                <Filters />
            </SheetContent>
        </Sheet>
    )
}