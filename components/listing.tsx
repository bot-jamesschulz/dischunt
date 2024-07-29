"use client"

import {
    Card
} from "@/components/ui/card";
import { type DiscListing } from "@/db/types";
import Image from "next/image";

export default function Listing({ discListing }:  { discListing: DiscListing } ) {
    const {details_url, listing, img_src, manufacturer, model } = discListing;
    const price = discListing.price >= 1000 ? discListing.price / 100 : discListing.price;
    const formattedPrice = price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })
    const url = new URL(details_url);
    const retailer = url.hostname;

    return (
        <a href={details_url} rel="external" target="_blank">
            <div className="flex flex-col justify-start items-center overflow-hidden gap-4">
                <div>
                    <Image
                        src={img_src}
                        width={1000}
                        height={1000}
                        alt=""
                        className="object-cover w-full h-56 rounded transition-opacity opacity-0 duration-[0.5s]"
                        onLoad={(img) => {
                            if (img.target instanceof HTMLElement) {
                                img.target.classList.remove(
                                "opacity-0"
                                );
                            }
                        }}
                    />
                </div>
                <div className="grow h-full flex flex-col justify-between items-center w-full">
                        <p className="text-sm">
                            {manufacturer}
                        </p>
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            {model}
                        </h4>
                        <p className="text-sm">
                            {listing}
                        </p>
                        <p className="font-normal leading-none tracking-tight">
                            {formattedPrice}
                        </p>   
                        <p>
                            {retailer}
                        </p> 
                </div>
            </div>
        </a>

    );
}
