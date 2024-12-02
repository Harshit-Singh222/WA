import {useEffect, useState} from "react";
import {Coordinates} from "@/api/type.ts";

interface GeoLocation {
    coordinates: Coordinates|null;
    error: string|null;
    isLoading: boolean;
}
export function useGeolocation(){
    const [locationData, setLocationData] = useState<GeoLocation>({
       coordinates: null,
       error: null,
       isLoading: true,
    });

    const getLocation = () => {
        setLocationData((prev) => ({...prev, isLoading: true, error:null}));
        if(!navigator.geolocation) {
            setLocationData({
                coordinates: null,
                error: "Geolocation is not supported by your brower",
                isLoading: false,
            });
            return;
        }

        navigator.geolocation.getCurrentPosition((position)=>{
            setLocationData({
                coordinates: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                isLoading: false,
            })
        },(error)=>{
            let errorMessage: string;

            switch (error.code){
                case error.PERMISSION_DENIED:
                    errorMessage = "Location permission denied. Please enable location access. Yo";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable. Yo";
                    break;
                case error.TIMEOUT:
                    errorMessage = "Location request timed out. Yo";
                    break;
                default:
                    errorMessage = "An unknown error occurred. Yo";
            }

            setLocationData({
                coordinates: null,
                error: errorMessage,
                isLoading: false,
            });
        },{
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        })
    };

    useEffect(() => {
        getLocation();
    }, []);

    return{
        ...locationData,
        getLocation,
    };
}