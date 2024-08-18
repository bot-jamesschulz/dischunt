import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import { defaultSort } from '@/components/sort';
import { useRef } from 'react';
import { 
  minSpeed, 
  maxSpeed,
  minGlide,
  maxGlide, 
  minTurn, 
  maxTurn, 
  minFade, 
  maxFade,
  type SliderValues
} from '@/components/filters';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useFilters() {
  const searchParams = useSearchParams()
  const brandFilterRef = useRef<string[]>([])
  const moldFilterRef = useRef<string[]>([])
  const typeFilterRef = useRef<string[]>([])
  const speedFilterRef = useRef<SliderValues>([minSpeed, maxSpeed])
  const glideFilterRef = useRef<SliderValues>([minGlide, maxGlide])
  const turnFilterRef = useRef<SliderValues>([minTurn, maxTurn])
  const fadeFilterRef = useRef<SliderValues>([minFade, maxFade])
  
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get('query') || '';
  const sort = searchParams.get('sort') || defaultSort;
  const speedFilter: SliderValues = [
    searchParams.get("minSpeed") ? Number(searchParams.get("minSpeed")) : minSpeed,
    searchParams.get("maxSpeed") ? Number(searchParams.get("maxSpeed")) : maxSpeed
  ];
  const glideFilter: SliderValues = [
    searchParams.get("minGlide") ? Number(searchParams.get("minGlide")) : minGlide,
    searchParams.get("maxGlide") ? Number(searchParams.get("maxGlide")) : maxGlide
  ];
  const turnFilter: SliderValues = [
    searchParams.get("minTurn") ? Number(searchParams.get("minTurn")): minTurn,
    searchParams.get("maxTurn") ? Number(searchParams.get("maxTurn")): maxTurn
  ];
  const fadeFilter: SliderValues = [
    searchParams.get("minFade") ? Number(searchParams.get("minFade")): minFade,
    searchParams.get("maxFade") ? Number(searchParams.get("maxFade")): maxFade
  ];
  const moldFilter = searchParams.getAll("mold");
  const typeFilter = searchParams.getAll("type");
  const brandFilter = searchParams.getAll("brand");


  if (JSON.stringify(brandFilter) !== JSON.stringify(brandFilterRef.current)) {
    brandFilterRef.current = brandFilter;
  }

  if (JSON.stringify(moldFilter) !== JSON.stringify(moldFilterRef.current)) {
    moldFilterRef.current = moldFilter;
  }

  if (JSON.stringify(typeFilter) !== JSON.stringify(typeFilterRef.current)) {
    typeFilterRef.current = typeFilter;
  }
  
  if (JSON.stringify(speedFilter) !== JSON.stringify(speedFilterRef.current)) {
    speedFilterRef.current = speedFilter;
  }

  if (JSON.stringify(glideFilter) !== JSON.stringify(glideFilterRef.current)) {
    glideFilterRef.current = glideFilter;
  }

  if (JSON.stringify(turnFilter) !== JSON.stringify(turnFilterRef.current)) {
    turnFilterRef.current = turnFilter;
  }

  if (JSON.stringify(fadeFilter) !== JSON.stringify(fadeFilterRef.current)) {
    fadeFilterRef.current = fadeFilter;
  }


  return {
    page,
    query,
    sort,
    brandFilter: brandFilterRef.current,
    moldFilter: moldFilterRef.current,
    typeFilter: typeFilterRef.current,
    speedFilter: speedFilterRef.current,
    glideFilter: glideFilterRef.current,
    turnFilter: turnFilterRef.current,
    fadeFilter: fadeFilterRef.current,
  }
}
