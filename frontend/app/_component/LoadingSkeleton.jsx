import React from "react";

export default function LoadingSkeleton({ height = 200 }) {
    return (
        <div
            className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl"
            style={{ minHeight: height }}
        >
            {/* Animated spinning loader */}
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse" />
            </div>
        </div>
    );
}