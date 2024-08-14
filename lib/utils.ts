import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import { useRef } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useFilters() {
  const searchParams = useSearchParams()
  const manufacturerFilterRef = useRef<string[]>([])
  const moldFilterRef = useRef<string[]>([])
  const typeFilterRef = useRef<string[]>([])
  
  const page = searchParams.get("page") || '1';
  const query = searchParams.get('query') || '';
  const moldFilter = searchParams.getAll("mold");
  const typeFilter = searchParams.getAll("type");
  const manufacturerFilter = searchParams.getAll("manufacturer");


  if (JSON.stringify(manufacturerFilter) !== JSON.stringify(manufacturerFilterRef.current)) {
    manufacturerFilterRef.current = manufacturerFilter;
  }

  if (JSON.stringify(moldFilter) !== JSON.stringify(moldFilterRef.current)) {
    moldFilterRef.current = moldFilter;
  }

  if (JSON.stringify(typeFilter) !== JSON.stringify(typeFilterRef.current)) {
    typeFilterRef.current = typeFilter;
  }


  return {
    page,
    query,
    manufacturerFilter: manufacturerFilterRef.current,
    moldFilter: moldFilterRef.current,
    typeFilter: typeFilterRef.current
  }
}
