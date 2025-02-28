export default function manifest() {
    return {
        name: "Finova",
        short_name: "Finova",
        description: "Best Budgets tracking app",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#2c095d",
        background_color: "#1f1e33",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png"
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png"
            },
            {
                src: "/icon-512-maskable.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ],
        "screenshots": [
            {
                "src": "/screenshot-1.png",
                "sizes": "640x320",
                "type": "image/png",
                "form_factor": "wide"
            },
            {
                "src": "/screenshot-2.png",
                "sizes": "800x600",
                "type": "image/png",
                "form_factor": "narrow"
            }
        ]
    }
}