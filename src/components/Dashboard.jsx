import React, { useState } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  Users, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { SCHOOL_INFO } from '../utils/config';

export default function Dashboard({ teachers, assignments }) {
  const [showAll, setShowAll] = useState(false);
  const sortedTeachers = [...teachers].sort((a, b) => b.count - a.count);
  const visibleTeachers = showAll ? sortedTeachers : sortedTeachers.slice(0, 5);
  
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">종합 현황</h2>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
            ● {SCHOOL_INFO.NAME}
          </span>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600"><CalendarDays size={24}/></div>
            <div>
              <p className="text-sm text-gray-500">누적 보결 수업</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}회</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 rounded-xl text-green-600"><CheckCircle2 size={24}/></div>
            <div>
              <p className="text-sm text-gray-500">완료된 배정</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}건</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-purple-50 rounded-xl text-purple-600"><Users size={24}/></div>
            <div>
              <p className="text-sm text-gray-500">전체 교원</p>
              <p className="text-2xl font-bold text-gray-900">{teachers.length}명</p>
            </div>
          </div>
        </div>
  
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-yellow-500">🏆</span> 보결 횟수 {showAll ? '(전체)' : 'TOP 5'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 transition-all duration-300">
            {visibleTeachers.map((teacher, idx) => (
              <div key={teacher.id} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                  idx === 1 ? 'bg-gray-200 text-gray-700' :
                  idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'
                }`}>
                  {idx + 1}위
                </div>
                <p className="font-bold text-gray-800">{teacher.name}</p>
                <p className="text-xs text-gray-500 mb-2">{teacher.grade} | {teacher.class}</p>
                <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {teacher.count}회
                </div>
              </div>
            ))}
          </div>
  
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showAll ? (
                <>접기 <ChevronUp size={16}/></>
              ) : (
                <>모든 교사 보기 <ChevronDown size={16}/></>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };