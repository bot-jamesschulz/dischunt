"use client"
 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search } from 'lucide-react';
import Image from "next/image";
import { 
  useRouter, 
  useSearchParams 
} from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { 
  useEffect,
  useState,
  useRef 
} from "react";
import Supabase from "@/db/config";
import { AutocompleteOption } from "@/db/types";
 
const FormSchema = z.object({
  query: z.string(),
})
const minSearchAutocomplete = 2;
 
export function InputForm({
  className 
}: {
  className?: string
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const listingOptionsRef = useRef<AutocompleteOption[]>([]);
  const selectRef = useRef<HTMLDivElement>(null);
  const [listingOptions, setListingOptions ] = useState<AutocompleteOption[]>([]);
  const curQuery = searchParams.get('query') || "";
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "",
    },
  });

  useEffect(() => {
    form.resetField('query')
  }, [curQuery, form])
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const currSearch = new URLSearchParams(searchParams);
    currSearch.set('query', data.query);
    currSearch.set('page', '1');
    
    router.push(`/results?${currSearch.toString()}`, { scroll: false })
  }

  const searchValue = form.watch('query');

  // Autocomplete
  useEffect(() => {
    let ignore = false

    const handleAutocomplete = async () => {

      if (!Supabase) return;

      const res = await Supabase
          .rpc('autocomplete', { search: searchValue})
      
      const optionsData = res.data
      
      if (Array.isArray(optionsData) && optionsData.length && !ignore) {

          const listings = optionsData.map(o => ({ listing: o.listing, img_src: o.img_src }))

          if (optionsData[0].greatest_sml === 1) {
              setOpen(false)
              return
          }

          listingOptionsRef.current = listings
          setListingOptions(listings)
          setOpen(true)
      } else {
          setOpen(false)
      }
    }

    if (searchValue.length >= minSearchAutocomplete && !listingOptionsRef.current.find(l => l.listing.toLowerCase() === searchValue.toLowerCase())) {
        handleAutocomplete()
    } else {
        setOpen(false)
    }        

    return () => {
        ignore = true
    }
},[searchValue])

// Closing of the autocomplete drop down
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {

      if (event.target instanceof Element && open && !selectRef?.current?.contains(event.target)) {
          setOpen(false);
      }
  }

  document.body.addEventListener("click", handleClickOutside)

  return () => {
      document.body.removeEventListener("click", handleClickOutside);
  }
}, [open])
 
  return (
    
    <div className="flex justify-center w-full lg:w-2/3 rounded-3xl py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={`flex justify-center content-center shadow-sm border rounded-xl p-2 ${className}`}>
          <div className="relative flex gap-2 w-full">
            <div className="basis-11/12">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input autoComplete="off" className="border-0" placeholder="Search for..." {...field} />
                    </FormControl>
                  <FormMessage />
                  </FormItem>
                )}
              />
              {open ? (
                <Command className="absolute z-10 w-11/12 h-auto rounded-xl bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95">
                  <CommandGroup ref={selectRef}>
                    {listingOptions.map((listing,index) => (
                      <CommandItem
                        key={index}
                        value={listing.listing}
                        onSelect={() => {
                        form.setValue('query', listing.listing)
                        setOpen(false)
                        onSubmit({ query: listing.listing })
                        }}
                      >
                      <div className="flex justify-between items-center w-full font-semibold">
                        <div>{listing.listing}</div>
                        <div className="w-24">
                          <Image
                            src={listing.img_src}
                            width={500}
                            height={500}
                            alt=""
                            className="object-contain w-full h-full rounded transition-opacity opacity-0 duration-[1s]"
                            onLoad={(img) => {
                                if (img.target instanceof HTMLElement) {
                                    img.target.classList.remove(
                                    "opacity-0"
                                    );
                                }
                            }}
                          />
                        </div>
                      </div>
                    </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              ) : null}
            </div>
          </div>
          <button type="submit" className="self-center">
            <Search strokeWidth={1.75} size={25} className='min-w-5 ml-1'/>
          </button>
        </form>
      </Form>
    </div>
  )
}