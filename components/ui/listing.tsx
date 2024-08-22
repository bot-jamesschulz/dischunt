"use client"

import { type DiscSearch} from "@/db/types";
import Image from "next/image";

export default function Listing({ discListing }:  { discListing: DiscSearch } ) {
    const {details_url, listing, img_src, brand, mold, speed, glide, turn, fade } = discListing;
    const price = discListing.price / 100;
    const formattedPrice = price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
    const url = new URL(details_url);
    const retailer = url.hostname;

    return (
        <a href={details_url} rel="external" target="_blank" className='text-ellipsis max-w-80'>
            <div className="flex flex-col justify-end items-center h-[400px] overflow-hidden gap-4">
                <div className="h-52 md:h-66">
                    <Image
                        src={img_src}
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
                <div className="flex flex-col items-center text-ellipsis w-full justify-between h-44">
                    <p className="text-sm">
                        {brand}
                    </p>
                    <h4 className="text-xl font-semibold tracking-tight">
                        {mold}
                    </h4>
                    <p className="text-sm text-center w-full h-10 text-ellipsis overflow-hidden line-clamp-2">
                        {speed} | {glide} | {turn} | {fade}
                    </p>
                    <p className="text-sm text-center w-full h-10 text-ellipsis overflow-hidden line-clamp-2">
                        {listing}
                    </p>
                    <p className="text-lg">
                        {formattedPrice}
                    </p>   
                    <p className="text-sm text-center truncate w-full text-slate-400 font-light">
                        {retailer}
                    </p> 
                </div>
            </div>
        </a>

    );
}
