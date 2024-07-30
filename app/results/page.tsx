import Listings from '@/components/listings';
import { InputForm } from '@/components/ui/input-form';
import { Suspense } from "react";

export default function Results() {

    return (
        <Suspense>
            <main className="flex min-h-screen flex-col items-center justify-between">
                <InputForm/>
                <Listings />
            </main>
        </Suspense>
    );
}
