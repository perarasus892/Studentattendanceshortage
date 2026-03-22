'use client';

import { useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';

interface Ad {
    id: number;
    image: string;
    title: string;
    description: string;
    link: string;
}

export function AdCarousel() {
    const [ads, setAds] = useState<Ad[]>([]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch('/api/ads');
                const data = await res.json();
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };
        fetchAds();
    }, []);

    if (ads.length === 0) return null;

    return (
        <div className="w-full">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent>
                    {ads.map((ad) => (
                        <CarouselItem key={ad.id}>
                            <div className="p-1">
                                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                    <CardContent className="flex flex-col md:flex-row p-0 items-stretch min-h-[200px]">
                                        <div className="w-full md:w-1/3 relative h-48 md:h-auto">
                                            <img
                                                src={ad.image}
                                                alt={ad.title}
                                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col justify-center flex-1">
                                            <span className="inline-block px-2 py-1 rounded bg-white/20 text-xs font-semibold mb-2 w-fit">CAMPUS NEWS</span>
                                            <h3 className="text-2xl font-bold mb-2">{ad.title}</h3>
                                            <p className="text-blue-50/90 mb-4">{ad.description}</p>
                                            <button className="px-5 py-2 bg-white text-blue-700 rounded-full font-bold text-sm w-fit hover:bg-blue-50 transition-colors">
                                                Learn More
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="absolute top-1/2 -left-4 -translate-y-1/2">
                    <CarouselPrevious className="h-8 w-8 rounded-full" />
                </div>
                <div className="absolute top-1/2 -right-4 -translate-y-1/2">
                    <CarouselNext className="h-8 w-8 rounded-full" />
                </div>
            </Carousel>
        </div>
    );
}
