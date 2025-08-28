// 'use client'
//
// import { useEffect, useState } from "react";
//
// export default function MyComponent() {
//     const [isMobile, setIsMobile] = useState(false);
//
//     useEffect(() => {
//         const checkMobile = () => {
//             setIsMobile(window.innerWidth <= 768); // можно 640, 1024 — как тебе удобно
//         };
//
//         checkMobile();
//         window.addEventListener("resize", checkMobile);
//         return () => window.removeEventListener("resize", checkMobile);
//     }, []);
//
//     return isMobile ? (
//         true
//     ) : (
//         <DesktopComponent />
//     );
// }
