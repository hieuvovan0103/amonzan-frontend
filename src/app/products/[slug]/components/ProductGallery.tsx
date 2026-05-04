'use client';

import { useState } from 'react';

type ProductGalleryProps = {
    images: string[];
    title: string;
};

export default function ProductGallery({
    images,
    title,
}: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-[4px] overflow-hidden border-2 flex-shrink-0 transition-all ${activeIndex === idx
                                ? 'border-[#007185] shadow-sm'
                                : 'border-[#E6E6E6] hover:border-[#D5D9D9]'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`${title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            <div className="flex-1 bg-[#F7F7F7] rounded-[6px] overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[500px]">
                <img
                    src={images[activeIndex]}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
