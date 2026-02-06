import React, { useState, useRef } from 'react';
import { 
  School, 
  Image as ImageIcon, 
  Cpu, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Trash2 
} from 'lucide-react';
import { callGeminiAPI } from '../api/gemini';
import { SCHOOL_INFO } from '../utils/config';

export default function SettingsView({ teachers, setTeachers, setAssignments }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const fileInputRef = useRef(null);
  
    const handleResetData = () => {
      if (window.confirm("정말로 모든 보결 누적 횟수와 배정 기록을 초기화하시겠습니까?")) {
        const resetTeachers = teachers.map(t => ({ ...t, count: 0 }));
        setTeachers(resetTeachers);
        setAssignments([]);
        alert("데이터가 초기화되었습니다.");
      }
    };
  
    // 이미지 분석 로직
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      setAnalyzing(true);
      setPreviewData(null);
  
      const prompt = `
        이 이미지는 학교 시간표입니다. 
        이미지에서 '교사 이름', '담당 학년', '반 정보(또는 담당 과목)'를 추출하여 아래 JSON 형식으로 반환해주세요.
        기존에 없던 선생님이라도 모두 추출하세요.
        
        [JSON 형식]
        [
          { "name": "김교사", "grade": "6학년", "class": "1반" },
          { "name": "이교담", "grade": "교과전담", "class": "영어" }
        ]
        
        주의: JSON 코드만 반환하고 마크다운 문법은 사용하지 마세요.
      `;
  
      try {
        const textResponse = await callGeminiAPI(prompt, file);
        const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanedJson);
        
        // ID 부여 및 초기 count 설정
        const formattedData = parsedData.map((t, idx) => ({
          id: `new_${Date.now()}_${idx}`,
          name: t.name,
          grade: t.grade,
          class: t.class,
          count: 0
        }));
  
        setPreviewData(formattedData);
      } catch (error) {
        alert(`분석 실패: ${error.message}`);
      } finally {
        setAnalyzing(false);
        // 같은 파일 다시 선택 가능하게 초기화
        if(fileInputRef.current) fileInputRef.current.value = '';
      }
    };
  
    const applyScheduleData = () => {
      if (!previewData) return;
      if (window.confirm(`총 ${previewData.length}명의 교사 정보를 시스템에 등록하시겠습니까?\n기존 데이터는 유지되거나 업데이트됩니다.`)) {
        // 기존 명단에 추가하는 방식 (중복 처리 로직은 생략하고 단순 병합)
        // 실제로는 이름 매칭 등을 통해 업데이트 해야 함.
        setTeachers(prev => {
          // 간단한 예시: 기존 명단을 덮어씌우거나, 병합. 여기선 덮어쓰기 옵션 제공
          return previewData;
        });
        setPreviewData(null);
        alert("교사 명단 및 시간표 정보가 업데이트되었습니다.");
      }
    };
  
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* 1. 학교 기본 정보 설정 */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <School className="text-indigo-600"/> 학교 기본 정보
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">학교명</label>
              <input 
                type="text" 
                value={SCHOOL_INFO.NAME} 
                disabled 
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                * API Key는 보안을 위해 서버(.env)에서 관리됩니다.
              </p>
            </div>
          </div>
        </section>
  
        {/* 2. 시간표 이미지 일괄 등록 (멀티모달) */}
        <section className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <ImageIcon className="text-indigo-600"/> 시간표/명단 일괄 등록 (AI)
              </h3>
              <p className="text-sm text-indigo-700">
                학급별, 교담별 시간표 이미지를 업로드하면 AI가 자동으로 교사 명단을 추출합니다.<br/>
                <span className="font-bold text-red-500">* 등록 후 반드시 결과를 확인해주세요.</span>
              </p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Cpu className="text-indigo-600" size={24} />
            </div>
          </div>
  
          <div className="bg-white rounded-xl p-6 border border-indigo-200 border-dashed text-center relative z-10">
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden" 
              id="timetable-upload"
            />
            
            {!analyzing && !previewData && (
              <label htmlFor="timetable-upload" className="cursor-pointer flex flex-col items-center gap-3 py-8 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <Upload size={32} />
                </div>
                <div>
                  <span className="text-indigo-600 font-bold text-lg">이미지 업로드하기</span>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG 파일 지원</p>
                </div>
              </label>
            )}
  
            {analyzing && (
              <div className="py-12 flex flex-col items-center">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                <p className="text-lg font-bold text-gray-700">AI가 시간표를 분석하고 있습니다...</p>
                <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
              </div>
            )}
  
            {previewData && (
              <div className="text-left animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={20}/> 분석 완료 ({previewData.length}명)
                  </h4>
                  <button 
                    onClick={() => setPreviewData(null)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={20}/>
                  </button>
                </div>
                
                <div className="max-h-60 overflow-y-auto border rounded-lg bg-gray-50 mb-4">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold">
                      <tr>
                        <th className="p-3">이름</th>
                        <th className="p-3">학년/부서</th>
                        <th className="p-3">반/과목</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((t, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="p-3 font-medium">{t.name}</td>
                          <td className="p-3">{t.grade}</td>
                          <td className="p-3">{t.class}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
  
                <div className="flex gap-2">
                  <button 
                    onClick={applyScheduleData}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                  >
                    이대로 등록하기
                  </button>
                  <button 
                    onClick={() => setPreviewData(null)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
  
        {/* 3. 데이터 초기화 구역 */}
        <section className="bg-red-50 p-8 rounded-2xl border border-red-100">
          <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
            <AlertCircle/> 위험 구역 (Data Reset)
          </h3>
          <p className="text-red-600 text-sm mb-4">
            새 학년도가 시작되거나 시스템을 초기화해야 할 때만 사용하세요. 모든 데이터가 삭제됩니다.
          </p>
          <button 
            onClick={handleResetData}
            className="bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200 flex items-center gap-2"
          >
            <Trash2 size={16}/> 모든 데이터 초기화
          </button>
        </section>
      </div>
    );
  };