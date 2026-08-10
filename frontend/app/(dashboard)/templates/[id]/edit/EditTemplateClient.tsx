'use client';

import { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { Type, Image as ImageIcon, Link as LinkIcon, Minus, Share2, Smartphone, Monitor, Save, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Helper components for DND
function DraggableBlock({ id, icon: Icon, label }: { id: string, icon: any, label: string }) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `draggable-${id}`,
    data: { type: id }
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50
  } : undefined;

  return (
    <div 
      ref={setNodeRef} style={style} {...listeners} {...attributes}
      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-grab hover:border-[#7C3AED] hover:shadow-sm transition-all"
    >
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300"><Icon size={16} /></div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
    </div>
  );
}

function CanvasArea({ blocks, onSelectBlock, selectedId }: { blocks: any[], onSelectBlock: (id: string) => void, selectedId: string | null }) {
  const {setNodeRef, isOver} = useDroppable({ id: 'canvas-droppable' });

  return (
    <div 
      ref={setNodeRef}
      className={`min-h-[500px] p-6 bg-white dark:bg-gray-900 border-2 rounded-xl transition-all ${
        isOver ? 'border-[#7C3AED] bg-purple-50/20' : 'border-dashed border-gray-300 dark:border-gray-700'
      }`}
    >
      {blocks.length === 0 ? (
        <div className="h-[450px] flex flex-col items-center justify-center text-center text-gray-400">
          <p className="font-medium text-base mb-1">এখানে ব্লক ড্র্যাগ করে এনে ছাড়ুন</p>
          <p className="text-xs text-gray-400">বাম পাশের প্যানেল থেকে টেক্সট, ছবি বা বাটন এনে ইমেইল ডিজাইন করুন</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => (
            <div 
              key={block.id}
              onClick={() => onSelectBlock(block.id)}
              className={`p-4 border rounded-lg cursor-pointer relative group transition-all ${
                selectedId === block.id ? 'border-[#7C3AED] ring-2 ring-purple-100 dark:ring-purple-900/40' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              {block.type === 'text' && (
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed font-['Anek_Bangla']">
                  {block.content || 'এখানে আপনার মেসেজ লিখুন... (ক্লিক করে সম্পাদনা করুন)'}
                </div>
              )}

              {block.type === 'image' && (
                <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-xs">ছবি আপলোড করুন (URL সেট করুন)</span>
                  </div>
                </div>
              )}

              {block.type === 'button' && (
                <div className="flex justify-center">
                  <button className="px-6 py-2.5 bg-[#7C3AED] text-white font-medium rounded-lg text-sm shadow-sm hover:bg-[#6D28D9]">
                    {block.content || 'এখানে ক্লিক করুন'}
                  </button>
                </div>
              )}

              {block.type === 'divider' && (
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditTemplateClient({ params }: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [blocks, setBlocks] = useState<any[]>([
    { id: 'b1', type: 'text', content: 'প্রিয় গ্রাহক, আমাদের নতুন প্রোডাক্ট কালেকশনে আপনাকে স্বাগতম!' },
    { id: 'b2', type: 'button', content: 'এখনই অফার দেখুন' }
  ]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('b1');

  const handleDragEnd = (event: any) => {
    const { over, active } = event;
    if (over && over.id === 'canvas-droppable') {
      const type = active.data.current?.type;
      if (type) {
        const newBlock = {
          id: `b_${Date.now()}`,
          type,
          content: type === 'button' ? 'বাটন লেবেল' : type === 'text' ? 'নতুন টেক্সট ব্লক...' : ''
        };
        setBlocks(prev => [...prev, newBlock]);
        setSelectedBlockId(newBlock.id);
      }
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-[calc(100vh-80px)] flex flex-col font-['Anek_Bangla'] -m-6">
        
        {/* Top Navbar */}
        <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/templates" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">টেমপ্লেট এডিটর (ID: {params.id})</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-white dark:bg-gray-700 text-[#7C3AED] shadow-sm' : 'text-gray-400'}`}
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-white dark:bg-gray-700 text-[#7C3AED] shadow-sm' : 'text-gray-400'}`}
              >
                <Smartphone size={16} />
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Eye size={16} /> প্রিভিউ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
              <Save size={16} /> সেভ করুন
            </button>
          </div>
        </div>

        {/* Builder Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Left: Draggable Elements */}
          <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 space-y-4 overflow-y-auto shrink-0">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">উপাদানসমূহ (Elements)</h2>
            <div className="space-y-2">
              <DraggableBlock id="text" icon={Type} label="টেক্সট ব্লক" />
              <DraggableBlock id="image" icon={ImageIcon} label="ছবি (Image)" />
              <DraggableBlock id="button" icon={LinkIcon} label="বাটন (CTA)" />
              <DraggableBlock id="divider" icon={Minus} label="ডিভাইডার (Line)" />
              <DraggableBlock id="social" icon={Share2} label="সোশ্যাল লিংক" />
            </div>
          </div>

          {/* Canvas Center */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-8 overflow-y-auto flex justify-center">
            <div className={`transition-all duration-300 ${viewMode === 'mobile' ? 'w-[375px]' : 'w-[650px]'}`}>
              <CanvasArea 
                blocks={blocks} 
                onSelectBlock={setSelectedBlockId} 
                selectedId={selectedBlockId} 
              />
            </div>
          </div>

          {/* Sidebar Right: Inspector Panel */}
          <div className="w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4 overflow-y-auto shrink-0">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">প্রোপার্টিজ (Properties)</h2>
            
            {selectedBlock ? (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 text-xs mb-1">ব্লক টাইপ</label>
                  <span className="capitalize font-semibold text-gray-900 dark:text-white">{selectedBlock.type}</span>
                </div>

                {selectedBlock.type === 'text' && (
                  <div>
                    <label className="block text-gray-500 dark:text-gray-400 text-xs mb-1">কন্টেন্ট</label>
                    <textarea 
                      rows={4}
                      value={selectedBlock.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBlocks(prev => prev.map(b => b.id === selectedBlock.id ? {...b, content: val} : b));
                      }}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                )}

                {selectedBlock.type === 'button' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-500 dark:text-gray-400 text-xs mb-1">বাটন টেক্সট</label>
                      <input 
                        type="text"
                        value={selectedBlock.content}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBlocks(prev => prev.map(b => b.id === selectedBlock.id ? {...b, content: val} : b));
                        }}
                        className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center py-8">
                সম্পাদনা করতে ক্যানভাস থেকে কোনো ব্লকে ক্লিক করুন
              </div>
            )}
          </div>

        </div>
      </div>
    </DndContext>
  );
}
