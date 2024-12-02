import {useFavourite} from "@/hooks/use-favorite.ts";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useNavigate} from "react-router-dom";
import {useWeatherQuery} from "@/hooks/use-weather.ts";
import {Button} from "@/components/ui/button.tsx";
import {Loader2, X} from "lucide-react";
import {toast} from "sonner";

interface FavouriteCityTableProp {
    id: string;
    name: string;
    lat: number;
    lon: number;
    onRemove: (id: string) => void;
};

const FavouriteCities = () => {
    const {favourites, removeFavourite}  = useFavourite();
    if(!favourites.length ){
        return null;
    }

    return (
        <>
            <h1 className="text-xl font-bold tracking-tight">Favourites</h1>
            <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                    {favourites.map((city) => {
                        return (
                            <FavouriteCityTable
                                key={city.id}
                                {...city}
                                onRemove={() => removeFavourite.mutate(city.id)}
                            />
                        )
                    })}
                </div>
            </ScrollArea>
        </>
    );
};

function FavouriteCityTable({id, name, lat, lon, onRemove}: FavouriteCityTableProp){
    const navigate = useNavigate();
    const {data: weather, isLoading} = useWeatherQuery({lat, lon});

    return (
        <div onClick={ () => navigate(`/city/${name}?lat=${lat}&lon${lon}`) }
            role="button"
             tabIndex={0}
             className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-lg"
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100"
                onClick={(e) => {
                    e.stopPropagation(); // stop above onClick
                    onRemove(id);
                    toast.error(`Removed ${name} from Favourites`);
                }}
            >
                <X className="h-4 w-4" />
            </Button>
            {isLoading ? (
                <div className="flex h-8 items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            ) : weather ? (
                <>
                    <div className="flex gap-2 items-center">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                            alt={weather.weather[0].description}
                            className="h-8 w-8"
                        />
                        <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-muted-foreground">{weather.sys.country}</p>
                        </div>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-xl font-bold">{Math.round(weather.main.temp)}°</p>
                        <p className="text-xs capitalize text-muted-foreground">{weather.weather[0].description}</p>
                    </div>
                </>
            ) : null }
        </div>
    )
}

export default FavouriteCities;