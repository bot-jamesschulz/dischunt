import { FilterTag } from '@/components/filterTag';
import { 
    useSearchParams, 
    useRouter, 
    usePathname 
} from "next/navigation";
import allMolds from "@/public/molds";
import { useFilters } from "@/lib/utils";
import { type Manufacturers } from './filters';

// type FilterTagsProps = {
//     resetQuery: () => void
//     resetLocation: () => void
//     moldsInRange: MoldCount[]
// }


export default function FilterTags() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { query, typeFilter, manufacturerFilter, moldFilter} = useFilters();
    const currSearch = new URLSearchParams(searchParams);
    
    const manufacturerUnselectHandler = (manufacturer: string) => {
  
        currSearch.set('page', '1')
        const newManufacturerFilter = currSearch.getAll('manufacturer').filter(m => m !== manufacturer)
        currSearch.delete('manufacturer')
        newManufacturerFilter.forEach((m) => {
            currSearch.append('manufacturer', m)
        })

        // Delete corresponding molds, and re-create mold params
        const newMoldFilter: string[] = [];
        newManufacturerFilter.forEach(m => {
            // Push the molds of the selected manufacturers
            if (m in allMolds) newMoldFilter.push(...allMolds[m as Manufacturers]); 
        });

        // Delete old molds
        currSearch.delete('mold');
        // Only add back the molds that are in the new mold filter
        moldFilter.forEach(mold => {
            if (newMoldFilter.includes(mold)) {
                currSearch.append('mold', mold)
            }
        })
        router.push(`${pathname}?${currSearch.toString()}`, { scroll: false })
    }

    const moldUnselectHandler = (mold: String) => {
  
        currSearch.set('page', '1')
        currSearch.delete('mold', moldFilter.find(m => m === mold))
        const newMoldFilter = currSearch.getAll('mold').filter(m => m !== mold)
        currSearch.delete('mold')
        newMoldFilter.forEach((m) => {
        currSearch.append('mold', m)
        })
        router.push(`${pathname}?${currSearch.toString()}`, { scroll: false })
    }

    const typeUnselectHandler = (type: String) => {
  
        currSearch.set('page', '1')
        currSearch.delete('type', typeFilter.find(t => t === type))
        const newTypeFilter = currSearch.getAll('type').filter(t => t !== type)
        currSearch.delete('type')
        newTypeFilter.forEach((t) => {
        currSearch.append('type', t)
        })
        router.push(`${pathname}?${currSearch.toString()}`, { scroll: false })
    }

    const queryUnselectHandler = () => {
        currSearch.set('query', '')
        currSearch.set('page', '1')
        router.push(`${pathname}?${currSearch.toString()}`, { scroll: false })
    }

    return (
        <div className='flex flex-wrap gap-2 px-2'>
            {query !== '' && <FilterTag title='QUERY' content={query} unselectHandler={queryUnselectHandler} />}
            {typeFilter.map((type) => (
                <FilterTag key={type} title='DISC TYPE' content={type} unselectHandler={typeUnselectHandler} />
            ))}
            {manufacturerFilter.map((manufacturer) => (
                <FilterTag key={manufacturer} title='BRAND' content={manufacturer} unselectHandler={manufacturerUnselectHandler} />
            ))}
            {moldFilter.map((mold) => (
                <FilterTag  key={mold} title='MOLD' content={mold} unselectHandler={moldUnselectHandler} />
            ))}
        </div>
    )
}