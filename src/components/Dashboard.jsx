import React, { useState } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  Users, 
  ChevronDown, 
  ChevronUp,
  X,
  Trash2,
  Search
} from 'lucide-react';
import { SCHOOL_INFO } from '../utils/config';

export default function Dashboard({ teachers, assignments, onDeleteTeacher }) {
  const [showAll, setShowAll] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false); // 교원 명단 모달 상태

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
        
        {/* 전체 교원 카드 (클릭 가능하도록 수정) */}
        <div 
          onClick={() => setIsListModalOpen(true)}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-indigo-300 transition-all hover:shadow-md group"
        >
          <div className="p-4 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition-colors"><Users size={24}/></div>
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              전체 교원 <Search size={12} className="opacity-50"/>
            </p>
            <p className="text-2xl font-bold text-gray-900">{teachers.length}명</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-yellow-500">🏆</span> 보결 횟수 {showAll ? '(전체)' : 'TOP 5'}
        </h3>
        
        {teachers.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p>등록된 교사가 없습니다.</p>
            <p className="text-sm">시스템 설정에서 시간표 이미지를 업로드하거나 교사를 등록해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 transition-all duration-300">
            {visibleTeachers.map((teacher, idx) => (
              <div key={teacher.id} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow relative group">
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
        )}

        {teachers.length > 5 && (
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
        )}
      </div>

      {/* [신규 기능] 전체 교원 명단 팝업 모달 */}
      {isListModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-indigo-600"/> 등록된 교원 명단 ({teachers.length}명)
              </h3>
              <button 
                onClick={() => setIsListModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500"/>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {teachers.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  데이터가 없습니다.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-bold text-gray-500 border-b border-gray-200">
                      <th className="py-3 px-2">이름</th>
                      <th className="py-3 px-2">학년/부서</th>
                      <th className="py-3 px-2">반/담당</th>
                      <th className="py-3 px-2 text-center">보결 횟수</th>
                      <th className="py-3 px-2 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 font-bold text-gray-800">{t.name}</td>
                        <td className="py-3 px-2 text-gray-600">{t.grade}</td>
                        <td className="py-3 px-2 text-gray-600">{t.class}</td>
                        <td className="py-3 px-2 text-center">
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                            {t.count}회
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button 
                            onClick={() => onDeleteTeacher(t.id)}
                            className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                            title="삭제"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsListModalOpen(false)}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}