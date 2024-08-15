import Image from "next/image";
import { InputForm } from "@/components/ui/input-form";
import manufacturers from "@/public/manufacturers";
import { Suspense } from "react";

const brandIconNames = [
  "Axiom",
  "Clash",
  "DGA",
  "Discmania",
  "Discraft",
  "Dynamic",
  "Infinite",
  "Innova",
  "Kastaplast",
  "Latitude64",
  "LoneStar",
  "MVP",
  "Prodigy",
  "ThoughtSpace",
  "TrashPanda",
  "Westside",
];
const discTypeIconNames = [
  "DistanceDriver",
  "ControlDriver",
  "Midrange",
  "Putter"
];

const discTypes = [
  "Distance Driver",
  "Control Driver",
  "Mid Range",
  "Putt & Approach"
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center m-8 sm:m-12 lg:m-24">
      <Suspense>
        <div className="relative">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            The largest selection of discs, anywhere.
          </h2>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Exactly the disc you want, at the best price.
          </h3>

          <InputForm className={'w-11/12 border-2 shadow-xl my-10'}/>
        </div>
        <div className="flex flex-wrap gap-8 justify-center items-center text-center">
          {discTypeIconNames.map((iconName, id) => (
            <a href={`/results?query=&page=1&type=${discTypes[id]}`} className='flex flex-col gap-2 justify-center items-center drop-shadow-md md:w-max w-1/3 hover:scale-105 transform transition-transform duration-300' key={id}>
              <Image
                width={100}
                height={100}
                priority
                src={`discTypeIcons/${iconName}.jpeg`}
                alt="Logo"
                className="rounded-full"
              />
              {discTypes[id]}
          </a>
          ))}      
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 sm:gap-8 gap-2 rounded-md sm:p-10 w-full drop-shadow-2xl">
          {brandIconNames.map((iconName, id) => (
            <a href={`/results?query=&page=1&manufacturer=${manufacturers[id]}`} className='flex justify-center items-center hover:scale-110 transform transition-transform duration-300' key={id}>
              <div className="">
                <Image
                  width={100}
                  height={100}
                  priority
                  src={`brandIcons/${iconName}.svg`}
                  alt="Logo"
                />
              </div>
          </a>
          
          ))}      
        </div>
      </Suspense>
    </main>
  );
}
