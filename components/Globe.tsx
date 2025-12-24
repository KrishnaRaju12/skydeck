
import React, { useEffect, useRef, useMemo, useState } from 'react';
import GlobeGL from 'react-globe.gl';
import { Flight } from '../types';

interface GlobeProps {
  flights: Flight[];
  theme?: 'dark' | 'light';
}

const Globe: React.FC<GlobeProps> = ({ flights, theme = 'dark' }) => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions for the globe
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Use light mode aesthetic for both themes as requested
  const arcsData = useMemo(() => {
    return flights.map(f => ({
      startLat: f.origin.lat,
      startLng: f.origin.lng,
      endLat: f.destination.lat,
      endLng: f.destination.lng,
      // Constant color scheme based on the light mode palette
      color: ['#0284c7', '#4f46e5'],
      name: `${f.origin.code} → ${f.destination.code}`
    }));
  }, [flights]);

  // Prepare point data (all unique airports)
  const pointsData = useMemo(() => {
    const airports = new Map();
    flights.forEach(f => {
      airports.set(f.origin.code, { lat: f.origin.lat, lng: f.origin.lng, label: f.origin.city });
      airports.set(f.destination.code, { lat: f.destination.lat, lng: f.destination.lng, label: f.destination.city });
    });
    return Array.from(airports.values());
  }, [flights]);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.8;
      
      // Initial POV
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
    }
  }, []);

  return (
    <div ref={containerRef} className={`w-full h-full relative globe-container transition-colors duration-500 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {dimensions.width > 0 && (
        <GlobeGL
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          
          // Using High Definition Blue Marble texture for both themes
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          
          // Constant Atmosphere
          showAtmosphere={true}
          atmosphereColor="#93c5fd"
          atmosphereAltitude={0.15}
          
          // Arcs
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={2}
          arcDashAnimateTime={3000}
          arcStroke={0.6}
          arcAltitudeAutoscale={0.5}
          
          // Points
          pointsData={pointsData}
          pointColor={() => '#38bdf8'}
          pointAltitude={0.01}
          pointRadius={0.4}
          pointsMerge={true}
          
          // Hex Binning
          hexBinPointsData={pointsData}
          hexBinPointWeight="weight"
          hexBinResolution={12}
          hexMargin={0.1}
          hexTopColor={() => '#38bdf8'}
          hexSideColor={() => 'rgba(14, 165, 233, 0.5)'}

          waitForGlobeReady={true}
          animateIn={true}
        />
      )}
      
      {/* Cinematic Overlay - subtle radial depth */}
      <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.2)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.1)_100%)]'}`}></div>
      
      {/* Bottom fade into UI - keeps theme awareness for the transition */}
      <div className={`absolute bottom-0 left-0 right-0 h-40 pointer-events-none bg-gradient-to-t ${
        theme === 'dark' ? 'from-neutral-950 to-transparent' : 'from-white to-transparent'
      }`}></div>
    </div>
  );
};

export default Globe;
