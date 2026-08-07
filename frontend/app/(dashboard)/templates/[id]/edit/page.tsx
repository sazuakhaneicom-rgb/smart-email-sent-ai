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
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function CanvasBlock({ id, type, isSelected, onClick }: { id: string, type: string, isSelected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-4 my-2 border-2 ${isSelected ? 'border-[#7C3AED]' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'} transition-colors cursor-pointer group`}
    >
      {type === 'header' && <h1 className="text-2xl font-bold text-center">এখানে আপনার শিরোনাম</h1>}
      {type === 'image' && <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200"><ImageIcon size={32} /></div>}
      {type === 'button' && <div className="text-center"><button className="px-6 py-3 bg-[#7C3AED] text-white rounded font-bold">এখানে ক্লিক করুন</button></div>}
      {type === 'text' && <p className="text-gray-600">আপনার সাধারণ টেক্সট এখানে যোগ করুন। এটি এডিট করা যাবে।</p>}
      {type === 'divider' && <hr className="my-4 border-gray-300" />}
      
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-[#7C3AED] text-white text-xs px-2 py-1 rounded shadow">Selected</div>
      )}
    </div>
  );
}

export default function TemplateEditor() {
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'header' },
    { id: '2', type: 'image' },
    { id: '3', type: 'text' },
    { id: '4', type: 'button' },
  ]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('1');

  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.data.current?.type) {
      const newBlock = {
        id: Date.now().toString(),
        type: active.data.current.type
      };
      setBlocks([...blocks, newBlock]);
      setSelectedBlockId(newBlock.id);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-['Anek_Bangla'] text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/templates" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <input 
            type="text" 
            defaultValue="নুতন টেমপ্লেট" 
            className="text-lg font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#7C3AED] focus:outline-none px-1 py-0.5 transition-colors" 
          />
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button onClick={() => setIsPreviewMobile(false)} className={`p-1.5 rounded ${!isPreviewMobile ? 'bg-white shadow text-[#7C3AED]' : 'text-gray-500 hover:text-gray-700'}`}>
            <Monitor size={18} />
          </button>
          <button onClick={() => setIsPreviewMobile(true)} className={`p-1.5 rounded ${isPreviewMobile ? 'bg-white shadow text-[#7C3AED]' : 'text-gray-500 hover:text-gray-700'}`}>
            <Smartphone size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            <Eye size={16} /> প্রিভিউ
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg transition-colors text-sm font-medium shadow-md shadow-[#7C3AED]/20">
            <Save size={16} /> সেভ
          </button>
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Blocks */}
          <div className="w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold">ব্লক যোগ করুন</h3>
              <p className="text-xs text-gray-500 mt-1">ক্যানভাসে টেনে দিন</p>
            </div>
            
            <div className="p-4 space-y-3">
              <DraggableBlock id="text" icon={Type} label="Text" />
              <DraggableBlock id="image" icon={ImageIcon} label="Image" />
              <DraggableBlock id="button" icon={LinkIcon} label="Button" />
              <DraggableBlock id="divider" icon={Minus} label="Divider" />
              <DraggableBlock id="social" icon={Share2} label="Social Icons" />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
              <h3 className="font-bold mb-3 text-sm">Merge Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['{{first_name}}', '{{email}}', '{{company}}'].map(tag => (
                  <button key={tag} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs rounded border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Canvas */}
          <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8 flex justify-center">
            <div 
              ref={setNodeRef}
              className={`bg-white shadow-xl min-h-[800px] transition-all duration-300 ${isPreviewMobile ? 'w-[375px]' : 'w-full max-w-[600px]'} ${isOver ? 'ring-2 ring-[#7C3AED] ring-opacity-50' : ''}`}
            >
              {blocks.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 m-4 rounded-lg">
                  <div className="text-center text-gray-400">
                    <Type size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-medium text-lg">ব্লক টেনে এখানে দিন</p>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  {blocks.map(block => (
                    <CanvasBlock 
                      key={block.id} 
                      id={block.id} 
                      type={block.type} 
                      isSelected={selectedBlockId === block.id}
                      onClick={() => setSelectedBlockId(block.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Properties */}
          <div className="w-[280px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold">প্রপার্টিজ</h3>
            </div>
            
            <div className="p-4">
              {!selectedBlockId ? (
                <div className="text-center py-10 text-gray-500">
                  <p>একটা ব্লক নির্বাচন করুন</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {blocks.find(b => b.id === selectedBlockId)?.type === 'text' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">টেক্সট</label>
                        <textarea className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm resize-none focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"></textarea>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">ফন্ট সাইজ</label>
                          <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm">
                            <option>14px</option>
                            <option>16px</option>
                            <option>18px</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">রঙ</label>
                          <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 bg-gray-800 rounded border border-gray-300 cursor-pointer"></div>
                            <span className="text-xs text-gray-500">#1F2937</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {blocks.find(b => b.id === selectedBlockId)?.type === 'button' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">বাটন টেক্সট</label>
                        <input type="text" defaultValue="এখানে ক্লিক করুন" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">URL (লিঙ্ক)</label>
                        <input type="url" placeholder="https://" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ব্যাকগ্রাউন্ড রঙ</label>
                        <div className="flex gap-2 items-center">
                          <div className="w-8 h-8 bg-[#7C3AED] rounded border border-gray-300 cursor-pointer"></div>
                          <input type="text" defaultValue="#7C3AED" className="w-24 px-2 py-1 text-xs border border-gray-300 rounded" />
                        </div>
                      </div>
                    </>
                  )}

                  {blocks.find(b => b.id === selectedBlockId)?.type === 'image' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">ইমেজ URL</label>
                        <input type="text" placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Alt Text</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#7C3AED] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">অ্যালাইনমেন্ট</label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm">
                          <option>Left</option>
                          <option>Center</option>
                          <option>Right</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  {['header', 'divider', 'social'].includes(blocks.find(b => b.id === selectedBlockId)?.type || '') && (
                    <div className="text-sm text-gray-500">
                      এই ব্লকের প্রপার্টিজগুলো এখানে কাস্টমাইজ করা যাবে।
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
                    <button 
                      onClick={() => {
                        setBlocks(blocks.filter(b => b.id !== selectedBlockId));
                        setSelectedBlockId(null);
                      }}
                      className="w-full py-2 text-red-500 border border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      ব্লক ডিলিট করুন
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
