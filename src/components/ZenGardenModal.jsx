// import React, { useRef, useEffect, useState } from 'react';
// import { X, Eraser, RotateCcw } from 'lucide-react';

// const ZenGardenModal = ({ isOpen, onClose }) => {
//   const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [strokeColor, setStrokeColor] = useState('#bc6c25'); // Default brown color
//     const [selectedEmoji, setSelectedEmoji] = useState('✨'); // Default emoji
// const [drawMode, setDrawMode] = useState('emoji'); // 'line' ya 'emoji' toggle ke liye

// const emojiList = ['✨', '🌸', '🍃', '🌊', '⭐', '🎈'];

// // Colors ki ek list bana lo
// const colors = [
//   { name: 'Classic Sand', code: '#e5d528' },
//   { name: 'Deep Sea', code: '#2a9d8f' },
//   { name: 'Rose Petal', code: '#dd1818' },
//   { name: 'Zen Grey', code: '#407cd7' }
// ];

//   useEffect(() => {
//     if (!isOpen) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     // Sand color and texture
//     ctx.fillStyle = '#f2e8cf';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   }, [isOpen]);

//   const startDrawing = (e) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const x = e.nativeEvent.offsetX;
//     const y = e.nativeEvent.offsetY;

//     if (drawMode === 'emoji') {
//       // ✅ Emoji Mode: Mouse niche jaate hi ek emoji stamp kar do
//       ctx.font = '40px serif';
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.fillText(selectedEmoji, x, y);
//       setIsDrawing(false); // Move hone par trail na bane
//     } else {
//       // ✅ Line Mode: Click par drawing mode ON aur naya rasta shuru
//       setIsDrawing(true);
//       ctx.beginPath();
//       ctx.moveTo(x, y);
//     }
//   };

//   const draw = (e) => {
//     // Agar mouse up hai ya Emoji mode hai, toh kuch mat karo
//     if (!isDrawing || drawMode === 'emoji') return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
    
//     // ✅ Line Mode: Mouse hilane par line banti rahegi
//     ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     ctx.strokeStyle = strokeColor;
//     ctx.lineWidth = 8;
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     if (drawMode === 'line') {
//       const ctx = canvasRef.current.getContext('2d');
//       ctx.closePath(); // ✅ Mouse up hote hi line khatam
//     }
//     setIsDrawing(false);
//     };
    
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
//       <div className="bg-[#fdf0d5] p-8 rounded-[3rem] shadow-2xl relative max-w-2xl w-full border-8 border-[#606c38]">
//         <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone-200 rounded-full">
//           <X size={24} className="text-stone-600" />
//         </button>
        
//         <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 text-center">Zen Sand Garden</h2>
        
//         <canvas
//   ref={canvasRef}
//   width={600}
//   height={400}
//   onMouseDown={startDrawing}
//   onMouseMove={draw}
//   onMouseUp={stopDrawing}
//   onMouseLeave={stopDrawing} // Canvas se bahar jane par bhi drawing ruke
//   className="w-full bg-[#f2e8cf] rounded-xl cursor-crosshair shadow-inner"
// />
              
//               <div className="flex flex-col gap-4 mt-4">
//                 {/* Mode Toggle: Line vs Emoji */}
//                 <div className="flex justify-center gap-2">
//                     <button
//                     onClick={() => setDrawMode('line')}
//                     className={`px-4 py-1 rounded-full text-sm font-bold ${drawMode === 'line' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600'}`}
//                     >
//                     Classic Rake (Line)
//                     </button>
//                     <button
//                     onClick={() => setDrawMode('emoji')}
//                     className={`px-4 py-1 rounded-full text-sm font-bold ${drawMode === 'emoji' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600'}`}
//                     >
//                     Emoji Stamp
//                     </button>
//                 </div>

//                 {/* Emoji Picker (Sirf tab dikhe jab mode 'emoji' ho) */}
//                 {drawMode === 'emoji' && (
//                     <div className="flex justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
//                     {emojiList.map((emoji) => (
//                         <button
//                         key={emoji}
//                         onClick={() => setSelectedEmoji(emoji)}
//                         className={`text-2xl p-2 rounded-xl transition-all ${
//                             selectedEmoji === emoji ? 'bg-white shadow-md scale-125 border-2 border-stone-300' : 'hover:bg-stone-100'
//                         }`}
//                         >
//                         {emoji}
//                         </button>
//                     ))}
//                     </div>
//                 )}
//                 </div>


//             {drawMode === 'line' && (
//                 <div className="flex justify-center gap-4 mb-4 animate-in fade-in duration-300">
//                     {colors.map((c) => (
//                     <button
//                         key={c.code}
//                         onClick={() => setStrokeColor(c.code)}
//                         className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
//                         strokeColor === c.code ? 'border-stone-800 scale-125' : 'border-transparent'
//                         }`}
//                         style={{ backgroundColor: c.code }}
//                         title={c.name}
//                     />
//                     ))}
//                 </div>
//             )}
            
//             {/* Ek Reset Button bhi daal dete hain canvas saaf karne ke liye */}
//             <button
//                 onClick={() => {
//                 const canvas = canvasRef.current;
//                 const ctx = canvas.getContext('2d');
//                 ctx.fillStyle = '#f2e8cf';
//                 ctx.fillRect(0, 0, canvas.width, canvas.height);
//                 }}
//                 className="ml-4 p-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-600"
//             >
//                 <RotateCcw size={18} />
//             </button>
//             </div>
                    
//         <p className="mt-4 text-stone-600 text-center italic">Draw slow, mindful patterns in the sand.</p>
//       </div>
//     </div>
//   );
// };

// export default ZenGardenModal; // ✅ Export Default zaroori hai

import React, { useRef, useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

const ZenGardenModal = ({ isOpen, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#e5d528'); 
  const [selectedEmoji, setSelectedEmoji] = useState('✨'); 
  const [drawMode, setDrawMode] = useState('emoji'); 

  const emojiList = ['✨', '🌸', '🍃', '🌊', '🎈'];
  const colors = [
    { name: 'Classic Sand', code: '#e5d528' },
    { name: 'Deep Sea', code: '#2a9d8f' },
    { name: 'Rose Petal', code: '#dd1818' },
    { name: 'Zen Grey', code: '#407cd7' }
  ];

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f2e8cf'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [isOpen]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (drawMode === 'emoji') {
      ctx.font = '40px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedEmoji, x, y);
      setIsDrawing(false); 
    } else {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (!isDrawing || drawMode === 'emoji') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (drawMode === 'line') {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
    }
    setIsDrawing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-[#fdf0d5] p-8 rounded-[3rem] shadow-2xl relative max-w-2xl w-full border-8 border-[#606c38]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone-200 rounded-full">
          <X size={24} className="text-stone-600" />
        </button>
        
        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 text-center">Zen Sand Garden</h2>
        
        <canvas 
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full bg-[#f2e8cf] rounded-xl cursor-crosshair shadow-inner"
        />
        
        <div className="flex flex-col gap-4 mt-6">
          {/* Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => setDrawMode('line')}
              className={`px-4 py-1 rounded-full text-sm font-bold ${drawMode === 'line' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600'}`}
            >
              Classic Rake (Line)
            </button>
            <button 
              onClick={() => setDrawMode('emoji')}
              className={`px-4 py-1 rounded-full text-sm font-bold ${drawMode === 'emoji' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-600'}`}
            >
              Emoji Stamp
            </button>
          </div>

          {/* --- Selection Row (Dynamic based on mode) --- */}
<div className="flex justify-center items-center gap-6 min-h-[60px]">
    
    {/* Emoji Picker - Only in Emoji Mode */}
    {drawMode === 'emoji' && (
        <div className="flex justify-center items-center gap-6 animate-in fade-in">
            <div className="flex gap-3">
                {emojiList.map((emoji) => (
                    <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-2xl p-2 rounded-xl transition-all ${selectedEmoji === emoji ? 'bg-white shadow-md scale-125 border-2 border-stone-300' : 'hover:bg-stone-100'}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => {
                    const ctx = canvasRef.current.getContext('2d');
                    ctx.fillStyle = '#f2e8cf'; 
                    ctx.fillRect(0, 0, 600, 400);
                }}
                className="p-2 bg-stone-200 hover:bg-red-100 hover:text-red-600 rounded-lg text-stone-600 transition-colors shadow-sm"
                title="Clear Sand"
            >
                <RotateCcw size={20} />
            </button>
        </div>
    )}

    {/* Color Picker - Only in Line Mode (Same Format & Dimensions) */}
    {drawMode === 'line' && (
        <div className="flex justify-center items-center gap-6 animate-in fade-in">
            <div className="flex gap-3">
                {colors.map((c) => (
                    <button
                        key={c.code}
                        onClick={() => setStrokeColor(c.code)}
                        // ✅ Dimension and padding matched with emoji buttons
                        className={`w-11 h-11 rounded-xl transition-all border-2 flex items-center justify-center ${strokeColor === c.code ? 'bg-white shadow-md scale-125 border-stone-800' : 'border-transparent hover:bg-stone-100'}`}
                    >
                        <div 
                            className="w-6 h-6 rounded-full shadow-sm" 
                            style={{ backgroundColor: c.code }} 
                        />
                    </button>
                ))}
            </div>

            <button 
                onClick={() => {
                    const ctx = canvasRef.current.getContext('2d');
                    ctx.fillStyle = '#f2e8cf'; 
                    ctx.fillRect(0, 0, 600, 400);
                }}
                className="p-2 bg-stone-200 hover:bg-red-100 hover:text-red-600 rounded-lg text-stone-600 transition-colors shadow-sm"
                title="Clear Sand"
            >
                <RotateCcw size={20} />
            </button>
        </div>
    )}
</div>
        </div>

        <p className="mt-4 text-stone-600 text-center italic text-sm">Draw slow, mindful patterns in the sand.</p>
      </div>
    </div>
  );
};

export default ZenGardenModal;