import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

export default function RequestForm({ setRequestData, setView }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    periods: [],
    reason: '',
    teacherName: ''
  });

  const togglePeriod = (period) => {
    setFormData(prev => ({
      ...prev,
      periods: prev.periods.includes(period) 
        ? prev.periods.filter(p => p !== period) 
        : [...prev.periods, period].sort()
    }));
  };

  const handleSubmit = () => {
    if (!formData.teacherName || formData.periods.length === 0) {
      alert("신청 교사와 보결 교시를 선택해주세요.");
      return;
    }
    setRequestData(formData);
    setView('assignment');
  };

  return (
    // [수정] max-w-2xl mx-auto 제거 -> 전체 너비 사용
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">보결 신청서 작성</h2>
      <p className="text-gray-500 mb-8">출장, 연수, 병가 등으로 인한 수업 결손 정보를 입력해주세요.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">신청 교사</label>
          <input 
            type="text" 
            placeholder="예: 5학년 3반 선생님"
            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.teacherName}
            onChange={e => setFormData({...formData, teacherName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">보결 일자</label>
          <input 
            type="date"
            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 font-bold text-lg text-indigo-700"
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">보결 교시 선택 (다중 선택)</label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, '점심', 5, 6].map((p) => (
              <button
                key={p}
                onClick={() => togglePeriod(p)}
                className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                  formData.periods.includes(p)
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs font-bold">{typeof p === 'number' ? 'PERIOD' : 'BREAK'}</span>
                <span className="text-lg font-black">{p}{typeof p === 'number' ? '교시' : ''}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">상세 사유</label>
          <textarea 
            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="사유를 입력하세요 (예: 관내 출장, 병가 등)"
            value={formData.reason}
            onChange={e => setFormData({...formData, reason: e.target.value})}
          />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Cpu size={20} />
          AI 보결 배정 요청하기
        </button>
      </div>
    </div>
  );
}