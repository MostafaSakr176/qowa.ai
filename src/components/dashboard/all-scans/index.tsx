"use client"
import React from "react";

const categories = [
    { label: "Web Apps", value: 14850 },
    { label: "Mobile Apps", value: 10750 },
    { label: "Infrastructure", value: 8740 },
    { label: "API", value: 4340 },
];

const barColors = [
    "#5B5BD6",
    "#6C6CDB",
    "#7D7DE0",
    "#8E8EE5"
];

// Format number as "14,85k" etc.
function formatK(val: number) {
    return (val / 1000)
        .toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        .replace(".", ",") + "k";
}

const maxValue = Math.max(...categories.map((c) => c.value));

/**
 * Calculate opacity based on value.
 * We'll use a minimum opacity of 0.3 and a maximum of 1.
 * The highest value gets opacity 1, the lowest gets 0.3.
 */
function getOpacity(value: number) {
    const minOpacity = 0.6;
    const maxOpacity = 1;
    if (maxValue === 0) return minOpacity;
    // Linear interpolation
    return minOpacity + ((value / maxValue) * (maxOpacity - minOpacity));
}

const AllScans = () => {
    return (
        <div className="p-6">
            <div className="mb-2">
                <span className="font-semibold text-lg text-black">All scans</span>
            </div>
            <div className="flex flex-col gap-2">
                {categories.map((cat, idx) => {
                    const widthPercent = (cat.value / maxValue) * 100;
                    const opacity = getOpacity(cat.value);
                    // Convert hex color to rgba with opacity
                    function hexToRgba(hex: string, alpha: number) {
                        let c = hex.replace('#', '');
                        if (c.length === 3) {
                            c = c.split('').map((x) => x + x).join('');
                        }
                        const num = parseInt(c, 16);
                        const r = (num >> 16) & 255;
                        const g = (num >> 8) & 255;
                        const b = num & 255;
                        return `rgba(${r},${g},${b},${alpha})`;
                    }
                    return (
                        <div
                            key={cat.label}
                            className="flex items-center relative"
                            style={{ minHeight: 40 }}
                        >
                            <div
                                className="flex items-center rounded-full w-full"
                                style={{
                                    background: hexToRgba(barColors[idx], opacity),
                                    width: `${widthPercent}%`,
                                    minHeight: 35,
                                    transition: "width 0.4s, background 0.4s",
                                    position: "relative",
                                }}
                            >
                                <span className="pl-4 pr-2 text-white font-medium text-[16px] z-10">
                                    {cat.label}
                                </span>
                                <span className="ml-auto pr-4 text-white font-medium text-[16px] z-10">
                                    {formatK(cat.value)}
                                </span>
                            </div>
                            {/* For the rest of the row, keep it transparent to preserve spacing */}
                            <div
                                className="absolute left-0 top-0 h-full rounded-full"
                                style={{
                                    width: "100%",
                                    pointerEvents: "none",
                                    zIndex: 0,
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AllScans;