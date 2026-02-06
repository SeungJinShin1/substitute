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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAnalyzing(true);
    setPreviewData(null);

    // [강력 수정] 전담 교사 환각 방지 프롬프트
    // 시간표 칸 안의 과목명(영어, 음악 등)을 보고 교사를 생성하지 않도록 엄격히 제한
    const prompt = `
      당신은 초등학교 시간표 분석 전문가입니다. 제공된 이미지에서 **'시간표의 주인' 단 1명**만 찾아서 JSON으로 반환하세요.

      [절대 규칙 - 위반 시 오답 처리]
      1. **시간표 칸 안에 적힌 과목명(국어, 수학, 사회, 과학, 영어, 음악, 미술, 체육, 도덕, 실과, 창체 등)을 보고 절대로 새로운 교사를 생성하지 마십시오.** 이것들은 단지 수업 내용일 뿐입니다.
      2. 시간표의 상단이나 제목에 적힌 **'학급명(예: 6학년 1반)'** 또는 **'담임 교사 이름'**을 확인하여, 그 학급의 담임 교사 1명 정보만 추출하세요.
      3. 만약 '전담 교사 시간표'라고 명확히 제목이 붙어있지 않다면, 무조건 담임 교사 시간표로 간주합니다.

      [추출 예시]
      - 이미지 제목이 '6학년 1반 시간표'인 경우 -> {"name": "6학년 1반 담임", "grade": "6학년", "class": "1반"} 만 추출.
      - 시간표 안에 '영어', '음악' 수업이 있어도 '영어 전담', '음악 전담' 교사는 절대 만들지 않음.

      [JSON 반환 형식]
      [
        { "name": "교사 이름 또는 O학년 O반 담임", "grade": "학년 정보", "class": "반 정보" }
      ]
      
      주의: 오직 JSON 코드만 반환하고, 마크다운 문법(Backticks)이나 다른 설명은 일절 포함하지 마세요.
    `;

    try {
      const textResponse = await callGeminiAPI(prompt, file);
      // JSON 파싱 전처리 (마크다운 ```json ... ``` 제거)
      const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedJson);
      
      const formattedData = parsedData.map((t, idx) => ({
        id: `new_${Date.now()}_${idx}`,
        name: t.name,
        grade: t.grade,
        class: t.class,
        count: 0
      }));

      setPreviewData(formattedData);
    } catch (error) {
      console.error("분석 에러:", error);
      alert(`AI 분석 실패: ${error.message}\n이미지가 너무 흐리거나 형식이 올바르지 않을 수 있습니다.`);
    } finally {
      setAnalyzing(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const applyScheduleData = () => {
    if (!previewData) return;
    if (window.confirm(`총 ${previewData.length}명의 교사 정보를 시스템에 등록하시겠습니까?\n기존 데이터에 추가됩니다.`)) {
      setTeachers(prev => {
        return [...prev, ...previewData];
      });
      setPreviewData(null);
      alert("교사 명단이 성공적으로 등록되었습니다.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full">
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
}