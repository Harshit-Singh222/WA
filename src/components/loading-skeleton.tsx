import {Skeleton} from "@/components/ui/skeleton.tsx";

export default function WeatherSkeleton(){
    return(
        <div className="space-y-6">
            <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-5">
                    <Skeleton className="h-[300px] w-full rounded-lg col-span-2" />
                    <Skeleton className="h-[300px] w-full rounded-lg col-span-3" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
        </div>
    )
}