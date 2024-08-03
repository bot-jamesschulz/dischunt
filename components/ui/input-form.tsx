"use client"
 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
 
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
      query: curQuery,
    },
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const currSearch = new URLSearchParams(searchParams);
    currSearch.set('query', data.query);
    currSearch.set('page', '1');
    
    router.push(`/results?${currSearch.toString()}`)
  }
 
  return (
    
    <div className="flex justify-center w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 flex flex-col justify-center content-center">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Halo Wraith" {...field} />
                </FormControl>
              <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-[200px] self-center">Search</Button>
        </form>
      </Form>
    </div>
  )
}