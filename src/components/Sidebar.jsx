import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle2, 
  Settings, 
  Cpu 
} from 'lucide-react';
import { SCHOOL_INFO } from '../utils/config';

export default function Sidebar({ currentView, setView }) {
  const menus = [
    { id: 'dashboard', label: '종합 현황판', icon: LayoutDashboard },
    { id: 'request', label: '보결 신청서', icon: FileText },
    { id: 'assignment', label: '배당 센터 (AI)', icon: CheckCircle2 },
    { id: 'settings', label: '시스템 설정', icon: Settings },
  ];
  
    return (
      <div className="w-64 bg-[#1a1c2e] text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
            <Cpu size={24} />
            SMART SUB
          </h1>
          <p className="text-xs text-gray-400 mt-1">{SCHOOL_INFO.NAME}</p>
        </div>
        
        <div className="flex-1 px-3 py-4 space-y-1">
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setView(menu.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === menu.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <menu.icon size={20} />
              <span className="font-medium">{menu.label}</span>
            </button>
          ))}
        </div>
  
      </div>
    );
  };