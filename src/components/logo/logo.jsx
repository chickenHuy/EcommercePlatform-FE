"use client"

import { useState } from "react"
import { Monitor, Zap } from "lucide-react"

export default function HKKUptechLogo() {
    const [hovered, setHovered] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto px-4">
            <div
                className={`relative flex items-center justify-center w-full p-3 sm:p-4 rounded-xl transition-all duration-300 bg-black-primary}`}
                style={{
                    transform: hovered ? "scale(0.75)" : "scale(0.7)",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="absolute -top-2 -left-2 bg-white-primary p-1 rounded-lg shadow-lg">
                    <Zap className="h-4 w-4 text-red-primary transition-colors duration-300" />
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Monitor className="h-6 w-6 text-white-primary transition-colors duration-300" />
                    <div className="text-white font-bold text-lg sm:text-xl md:text-2xl tracking-tight">
                        <span className="font-black">HKK</span>
                        <span className="text-gray-300">-</span>
                        <span className="transition-colors duration-300" style={{ color: hovered ? "#ffffff" : "#ef4444" }}>
                            Uptech
                        </span>
                    </div>
                </div>

                {hovered && (
                    <div className="absolute -bottom-2 text-[10px] sm:text-xs font-medium bg-white-primary px-2 py-0.5 rounded-full shadow-md">
                        <span className="tracking-wider text-gray-secondary">Electronics E-commerce</span>
                    </div>
                )}
            </div>
        </div>
    )
}
