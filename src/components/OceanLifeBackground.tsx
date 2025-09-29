// import React, { useEffect, useState } from 'react';
// // import jellyfishImage from '@/assets/floating-jellyfish.jpg';
// import planktonImage from '@/assets/floating-plankton.jpg';
// import fishImage from '@/assets/floating-fish.jpg';
// import jellyfishImage from '@/assets/jelly.webp';

// interface FloatingElement {
//   id: number;
//   type: 'jellyfish' | 'plankton' | 'fish';
//   x: number;
//   y: number;
//   size: number;
//   speed: number;
//   opacity: number;
//   rotation: number;
//   animationDelay: number;
// }

// const OceanLifeBackground: React.FC = () => {
//   const [elements, setElements] = useState<FloatingElement[]>([]);

//   useEffect(() => {
//     const generateElements = () => {
//       const newElements: FloatingElement[] = [];
//       const types: Array<'jellyfish' | 'plankton' | 'fish'> = ['jellyfish', 'plankton', 'fish'];
      
//       for (let i = 0; i < 30; i++) {
//         newElements.push({
//           id: i,
//           type: types[Math.floor(Math.random() * types.length)],
//           x: Math.random() * 100,
//           y: Math.random() * 100,
//           size: Math.random() * 200 + 100, // 100-300px
//           speed: Math.random() * 20 + 10, // 10-30s
//           opacity: Math.random() * 0.4 + 0.1, // 0.1-0.5
//           rotation: Math.random() * 360,
//           animationDelay: Math.random() * 10,
//         });
//       }
//       setElements(newElements);
//     };

//     generateElements();
//   }, []);

//   const getImageSrc = (type: string) => {
//     switch (type) {
//       case 'jellyfish': return jellyfishImage;
//       case 'plankton': return planktonImage;
//       case 'fish': return fishImage;
//       default: return jellyfishImage;
//     }
//   };

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {elements.map((element) => (
//         <div
//           key={element.id}
//           className="absolute animate-ocean-float"
//           style={{
//             left: `${element.x}%`,
//             top: `${element.y}%`,
//             width: `${element.size}px`,
//             height: `${element.size}px`,
//             opacity: element.opacity,
//             transform: `rotate(${element.rotation}deg)`,
//             animationDuration: `${element.speed}s`,
//             animationDelay: `${element.animationDelay}s`,
//           }}
//         >
//           <img
//             src={getImageSrc(element.type)}
//             alt=""
//             className="w-full h-full object-cover rounded-full blur-sm"
//             style={{
//               filter: `blur(1px) brightness(0.9) contrast(1.3) saturate(1.2)`,
//               mixBlendMode: 'lighten',
//             }}
//           />
          
//           {/* Bioluminescent glow effect with enhanced animation */}
//           <div
//             className="absolute inset-0 rounded-full animate-bio-pulse"
//             style={{
//               background: `radial-gradient(circle, 
//                 hsl(var(--bio-cyan) / 0.4) 0%, 
//                 hsl(var(--bio-teal) / 0.3) 30%, 
//                 hsl(var(--bio-green) / 0.2) 60%,
//                 transparent 80%)`,
//               filter: 'blur(6px)',
//             }}
//           />
//         </div>
//       ))}
      
//       {/* Floating video-like panels */}
//       <div className="absolute top-20 right-20 w-64 h-40 glass-card opacity-30 animate-float">
//         <div className="w-full h-full bg-gradient-to-br from-bio-cyan/20 to-bio-teal/20 rounded-lg p-4">
//           <div className="h-full bg-ocean-depth/50 rounded flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-8 h-8 bg-bio-cyan rounded-full mx-auto mb-2 animate-pulse-bio"></div>
//               <p className="text-xs text-bio-cyan">Marine Ecosystem</p>
//               <p className="text-xs text-muted-foreground">Live Feed</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="absolute bottom-32 left-16 w-48 h-32 glass-card opacity-40 animate-float" style={{ animationDelay: '2s' }}>
//         <div className="w-full h-full bg-gradient-to-br from-bio-green/20 to-bio-blue/20 rounded-lg p-3">
//           <div className="h-full bg-ocean-depth/50 rounded flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-6 h-6 bg-bio-green rounded-full mx-auto mb-2 animate-pulse-bio"></div>
//               <p className="text-xs text-bio-green">Phylogeny Trace</p>
//               <p className="text-xs text-muted-foreground">Real-time</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="absolute top-1/2 left-8 w-56 h-36 glass-card opacity-25 animate-float" style={{ animationDelay: '4s' }}>
//         <div className="w-full h-full bg-gradient-to-br from-bio-teal/20 to-bio-cyan/20 rounded-lg p-4">
//           <div className="h-full bg-ocean-depth/50 rounded flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-10 h-10 bg-bio-teal rounded-full mx-auto mb-2 animate-pulse-bio flex items-center justify-center">
//                 <span className="text-xs text-ocean-depth">🧬</span>
//               </div>
//               <p className="text-xs text-bio-teal">DNA Analysis</p>
//               <p className="text-xs text-muted-foreground">Processing...</p>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Ambient bubbles */}
//       {Array.from({ length: 20 }, (_, i) => (
//         <div
//           key={`bubble-${i}`}
//           className="absolute rounded-full bg-bio-cyan/20 animate-float"
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             width: `${Math.random() * 8 + 4}px`,
//             height: `${Math.random() * 8 + 4}px`,
//             animationDuration: `${Math.random() * 6 + 4}s`,
//             animationDelay: `${Math.random() * 5}s`,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default OceanLifeBackground;




// 





import React, { useEffect, useState } from "react";

// Demo images – replace with your actual fish/jelly jpg/png/webp
import fish1 from "@/assets/fish.jpg";
import fish2 from "@/assets/fish2.jpg";
import fish3 from "@/assets/fish3.jpg";
import fish4 from "@/assets/fish4.jpg";
import fish5 from "@/assets/jelly.jpg";
import fish6 from "@/assets/plaktton.jpg";

interface FloatingElement {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  animationDelay: number;
  direction: "left" | "right";
  zIndex: number;
}

const OceanLifeBackground: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const imgs = [fish1, fish2, fish3, fish4, fish5, fish6];
    const newEls: FloatingElement[] = Array.from({ length: 20 }, (_, i) => {
      const src = imgs[Math.floor(Math.random() * imgs.length)];
      return {
        id: i,
        src,
        x: Math.random() * 90, // full width
        y: Math.random() * 90, // full height
        size: Math.random() * 150 + 80, // 80–230px
        speed: Math.random() * 25 + 20, // 20–45s
        opacity: Math.random() * 0.4 + 0.6, // 0.6–1
        animationDelay: Math.random() * 10,
        direction: i % 2 === 0 ? "right" : "left",
        zIndex: Math.random() > 0.5 ? 5 : 1, // some in front, some behind
      };
    });
    setElements(newEls);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none bg-gradient-to-b from-sky-900 via-sky-950 to-black">
      {elements.map((el) => (
        <div
          key={el.id}
          className={`absolute ${
            el.direction === "right"
              ? "animate-drift-right"
              : "animate-drift-left"
          }`}
          style={{
            top: `${el.y}%`,
            left: `${el.x}%`,
            width: `${el.size}px`,
            opacity: el.opacity,
            animationDuration: `${el.speed}s`,
            animationDelay: `${el.animationDelay}s`,
            zIndex: el.zIndex,
          }}
        >
          <img
            src={el.src}
            alt="fish"
            className="w-full h-full object-cover rounded-[50%]"
            style={{
              filter:
                "drop-shadow(0px 0px 12px rgba(0,200,255,0.3)) brightness(0.95) contrast(1.2) saturate(1.2)",
            }}
          />
        </div>
      ))}

      {/* Floating bubbles */}
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-cyan-200/20 animate-bubble"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            animationDuration: `${Math.random() * 10 + 6}s`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}

      {/* Keyframes */}
      <style>{`
        @keyframes drift-right {
          0% {
            transform: translateX(-20vw);
          }
          100% {
            transform: translateX(120vw);
          }
        }
        @keyframes drift-left {
          0% {
            transform: translateX(120vw) scaleX(-1);
          }
          100% {
            transform: translateX(-20vw) scaleX(-1);
          }
        }
        .animate-drift-right {
          animation: drift-right linear infinite;
        }
        .animate-drift-left {
          animation: drift-left linear infinite;
        }

        @keyframes bubble {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40vh) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation: bubble linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OceanLifeBackground;
