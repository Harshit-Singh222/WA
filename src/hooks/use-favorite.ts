import {useLocalStorage} from "@/hooks/use-local-storage.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

interface FavoriteCity {
    id: string;
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
    addedAt: number;
};
export function useFavourite(){
    const [favourites, setFavourites] = useLocalStorage<FavoriteCity[]>("favourites", []);

    const queryClient = useQueryClient();

    const favouritesQuery = useQuery({
        queryKey: ["favourites"],
        queryFn: () => favourites,
        initialData: favourites,
        staleTime: Infinity,
    });

    const addFavourite = useMutation({
        mutationFn: async (
            city: Omit<FavoriteCity, "id"|"addedAt">
        ) => {
            const newFavourite: FavoriteCity = {
                ...city,
                id: `${city.lat}-${city.lon}`,
                addedAt: Date.now(),
            };

            const exists = favourites.some(
                (fav)=> fav.id === newFavourite.id
            );
            if(exists) return favourites;

            const newFavourites = [...favourites, newFavourite].slice(0,10);

            setFavourites(newFavourites);
            return newFavourites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favourites"],
            })
        },
    });

    const removeFavourite = useMutation({
        mutationFn: async (cityId: string) => {
            const newFavourites = favourites.filter((city) => city.id !== cityId);
            setFavourites(newFavourites);
            return newFavourites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favourites"],
            })
        },
    });

    return{
        favourites: favouritesQuery.data ?? [],
        addFavourite,
        removeFavourite,
        isFavourite: (lat: number, lon: number) => favourites.some((city)=> city.lat === lat && city.lon === lon)
        ,
    }
}