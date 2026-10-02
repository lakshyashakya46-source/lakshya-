import React, { useState, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Initial Ground Condition (Before)',
  afterLabel = 'Completed & Inspected (After)',
  title = 'Real-Time Transformation Audit'
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);

  // Backend API URL
  const API_URL = 'http://localhost:5000';

  // Convert DB image path into a complete URL
  const getImageUrl = (image) => {
    if (!image) return '';

    // If image is already a complete URL
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    // If image comes from backend like:
    // /uploads/schools/8190210526_after.jpg
    return `${API_URL}${image}`;
  };

  const handleMove = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = clientX - rect.left;

    let position = (x / rect.width) * 100;

    if (position < 0) position = 0;
    if (position > 100) position = 100;

    setSliderPosition(position);
  };

  const handleTouchMove = (e) => {
    if (!e.touches || !e.touches[0]) return;

    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    handleMove(e.clientX);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Final image URLs
  const finalBeforeImage =
    getImageUrl(beforeImage) ||
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80';

  const finalAfterImage =
    getImageUrl(afterImage) ||
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80';

console.log("BEFORE:", beforeImage);
console.log("AFTER:", afterImage);

  return (
    <div className="relative select-none overflow-hidden rounded-xl border border-slate-300 shadow-md bg-slate-900">

      {/* Title bar */}
      <div className="bg-slate-900/90 text-white text-[11px] px-3 py-1.5 flex justify-between items-center border-b border-slate-800">
        <span className="font-semibold tracking-wide text-amber-400 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {title}
        </span>

        <span className="text-slate-400">
          Drag center bar to compare
        </span>
      </div>

      {/* Image comparison area */}
      <div
        ref={containerRef}
        className="relative h-64 sm:h-80 w-full overflow-hidden cursor-ew-resize touch-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          if (e.touches && e.touches[0]) {
            handleMove(e.touches[0].clientX);
          }
        }}
        onTouchMove={handleTouchMove}
      >

        {/* =========================
            AFTER IMAGE
        ========================== */}
        <img
          src={finalAfterImage}
          alt="After renovation"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* After Tag */}
        <div className="absolute top-3 right-3 bg-emerald-700/90 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg backdrop-blur pointer-events-none">
          ✨ {afterLabel}
        </div>

        {/* =========================
            BEFORE IMAGE
        ========================== */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            width: `${sliderPosition}%`
          }}
        >
          <img
            src={finalBeforeImage}
            alt="Before renovation"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* =========================
            DIVIDER + HANDLE
        ========================== */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none"
          style={{
            left: `${sliderPosition}%`
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-900 shadow-xl flex items-center justify-center text-slate-800 text-xs font-bold pointer-events-auto cursor-ew-resize hover:scale-110 transition">
            ⇄
          </div>
        </div>

        {/* Before Tag */}
        <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg backdrop-blur pointer-events-none">
          {beforeLabel}
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="bg-slate-900 px-3 py-1 text-[11px] text-slate-400 flex justify-between font-mono">
        <span>0% (Before)</span>
        <span>Slide to Inspect</span>
        <span>100% (After)</span>
      </div>

    </div>
  );
}