import { FilterTag } from '@/components/filterTag';
import { 
    useSearchParams, 
    useRouter, 
    usePathname 
} from "next/navigation";
import allMolds from "@/public/molds";
import { useFilters } from "@/lib/utils";
import { type Brands } from './filters';

// type FilterTagsProps = {
//     resetQuery: () => void
//     resetLocation: () => void
//     moldsInRange: MoldCount[]
// }


export default function FilterTags() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { query, typeFilter, brandFilter, moldFilter} = useFilters();
    const currSearch = new URLSearchParams(searchParams);
    
    const brandUnselectHandler = (brand: string) => {
  
        currSearch.set('page', '1')
        const newBrandFilter = currSearch.getAll('brand').filter(m => m !== brand)
        currSearch.delete('brand')
        newBrandFilter.forEach((m) => {
            currSearch.append('brand', m)
        })

        // Delete corresponding molds, and re-create mold params
        const newMoldFilter: string[] = [];
        newBrandFilter.forEach(m => {
            // Push the molds of the selected brands
            if (m in allMolds) newMoldFilter.push(...allMolds[m as Brands]); 
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
            {brandFilter.map((brand) => (
                <FilterTag key={brand} title='BRAND' content={brand} unselectHandler={brandUnselectHandler} />
            ))}
            {moldFilter.map((mold) => (
                <FilterTag  key={mold} title='MOLD' content={mold} unselectHandler={moldUnselectHandler} />
            ))}
        </div>
    )
}