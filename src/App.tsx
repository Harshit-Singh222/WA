import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "@/components/layout.tsx";
import {ThemeProvider} from "@/context/theme-provider.tsx";
import WeatherDashboard from "@/pages/weather-dashboard.tsx";
import CityPage from "@/pages/city-page.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/sonner.tsx";

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5*60*1000, // 5 min
                gcTime: 10*6*1000, // 10 min
                retry: false,
                refetchOnWindowFocus: false,
            }
        }
    })
    return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
           <ThemeProvider defaultTheme="dark">
               <Layout>
                   <Routes>
                       <Route path="/" element={<WeatherDashboard />} />
                       <Route path="/city/:cityName" element={<CityPage />} />
                   </Routes>
               </Layout>
               <Toaster richColors />
           </ThemeProvider>
        </BrowserRouter>
    </QueryClientProvider>
    )
}

export default App
