import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

type PaginateProps = {
    className?: string | undefined
    resultsCount: number
}

const pageSize = 24;

export default function Paginate({ className, resultsCount }: PaginateProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currSearch = new URLSearchParams(searchParams);
    const currPage = Number(searchParams.get('page')) || 1;
    const currResults = currPage * pageSize;
    const pageCount = Math.ceil(resultsCount / pageSize);

    const nextPageParams = currSearch;
    nextPageParams.set('page', (Number(currPage) + 1).toString());
    const nextPageHref = `${pathname}?${nextPageParams}`;

    const prevPageParams = currSearch;
    prevPageParams.set('page', (Number(currPage) - 1).toString());
    const prevPageHref = `${pathname}?${prevPageParams}`;

    const firstPageParams = currSearch;
    firstPageParams.set('page', '1');
    const firstPageHref = `${pathname}?${firstPageParams}`;

    const lastPageParams = currSearch;
    lastPageParams.set('page', pageCount.toString());
    const lastPageHref = `${pathname}?${lastPageParams}`;

    return (
        <Pagination className={`${className}`}>
            
                {currPage > 1 && (
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious rel='prev' href={prevPageHref}/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href={firstPageHref}>1</PaginationLink>
                        </PaginationItem>
                        {currPage > 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                )}
                {pageCount >= 1 && (
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationLink href="#" className='text-lg hover:bg-transparent hover:cursor-default'>{currPage}</PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                )}
                {pageCount > 1 && currPage < pageCount && (
                    <PaginationContent>
                        {(pageCount - currPage) > 1 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink href={lastPageHref}>{pageCount}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext rel='next' href={nextPageHref} />
                        </PaginationItem>
                    </PaginationContent>
                )}
            
        </Pagination>
    )
}