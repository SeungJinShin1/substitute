import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Cpu, RefreshCw } from 'lucide-react';
import { callGeminiAPI } from '../api/gemini';
import { SCHOOL_INFO, SCHOOL_RULES, ENV_CONFIG } from '../utils/config';

export default function AssignmentCenter({ requestData, teachers, updateTeacherCount }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (requestData && !result && !loading) {
      runAIAnalysis();
    }
  }, [requestData]);

  const runAIAnalysis = async () => {
    if (!ENV_CONFIG.GEMINI_KEY) {
      setError("환경 변수(.env)에 API 키가 설정되지 않았습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    const prompt = `
    당신은 ${SCHOOL_INFO.NAME}의 교무부장 역할을 하는 AI 알고리즘입니다. 아래 규정과 교사 현황 데이터를 바탕으로 보결 교사를 추천하세요.
    응답은 반드시 유효한 JSON 형식이어야 합니다.

    [규정]
    ${SCHOOL_RULES}

    [현황]
    ${JSON.stringify(teachers.map(t => ({ name: t.name, grade: t.grade, count: t.count })))}

    [요청]
    교사: ${requestData.teacherName}, 일시: ${requestData.date}, 교시: ${requestData.periods.join(', ')}, 사유: ${requestData.reason}

    [JSON 예시]
    {
      "assignments": [
        { "period": "1교시", "recommendedTeacher": "교담1", "currentCount": 4, "reasoning": "이유 설명" }
      ]
    }
    `;

    try {
      const responseText = await callGeminiAPI(prompt);
      const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      setResult(JSON.parse(jsonString));
    } catch (e) {
      setError("AI 분석 실패: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmAssignment = () => {
    if (!result) return;
    result.assignments.forEach(assign => {
      const teacher = teachers.find(t => t.name === assign.recommendedTeacher);
      if (teacher) {
        updateTeacherCount(teacher.id, 1);
      }
    });
    alert("배정 확정 완료!");
  };

  if (!requestData) return <div className="text-center text-gray-400 py-20">보결 신청서를 먼저 작성해주세요.</div>;

  return (
    // [수정] max-w-4xl mx-auto 제거 -> 전체 너비 사용
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">보결 배당 센터</h2>
        <div className="text-sm text-gray-500">{requestData.date} | {requestData.teacherName}</div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-12 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <h3 className="text-xl font-bold text-indigo-900 mb-2">AI Analyzing...</h3>
          <p className="text-gray-500">학교 규정 및 NEIS 시간표 연동(예정) 데이터를 분석합니다.</p>
        </div>
      ) : result ? (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
             <div>
               <p className="text-indigo-100 text-sm font-semibold mb-1">AI Recommendation Complete</p>
               <h3 className="text-xl font-bold">분석이 완료되었습니다.</h3>
             </div>
             <button 
                onClick={runAIAnalysis}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
             >
               <RefreshCw size={20}/>
             </button>
          </div>

          {result.assignments.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex flex-col items-center justify-center font-bold shadow-inner flex-shrink-0">
                  <span className="text-xs">PERIOD</span>
                  <span className="text-xl">{item.period.replace('교시','')}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{item.recommendedTeacher}</h4>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md ml-2">
                        누적 {item.currentCount}회
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
                      <Cpu size={14} /> AI Logical Thinking Process
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button 
              onClick={confirmAssignment}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <CheckCircle2 />
              이대로 배정 확정하기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}