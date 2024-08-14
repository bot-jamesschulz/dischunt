"use client"
 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search } from 'lucide-react';
import { 
  useRouter, 
  useSearchParams 
} from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
 
const FormSchema = z.object({
  query: z.string(),
})
 
export function InputForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const curQuery = searchParams.get('query') || "";
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "",
    },
  })

  useEffect(() => {
    form.resetField('query')
  }, [curQuery, form])
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const currSearch = new URLSearchParams(searchParams);
    currSearch.set('query', data.query);
    currSearch.set('page', '1');
    
    router.push(`/results?${currSearch.toString()}`, { scroll: false })
  }
 
  return (
    
    <div className="flex justify-center w-2/3 rounded-3xl py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center content-center shadow-sm border rounded-xl p-2">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input className="border-0" placeholder="Search for..." {...field} />
                </FormControl>
              <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit" className="self-center">
            <Search strokeWidth={1.75} size={25} className='min-w-5 ml-1'/>
          </button>
        </form>
      </Form>
    </div>
  )
}