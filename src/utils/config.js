const SCHOOL_INFO = {
    NAME: "천안용암초등학교",
    VERSION: "v2.0 (Security & Multimodal)",
  };
  
  const ENV_CONFIG = {
    GEMINI_KEY: import.meta.env?.VITE_GEMINI_API_KEY || "",
  };
  
  const SCHOOL_RULES = `
  가. 1일 이하의 수업결손 시
  1) 2시간 이하: 동학년 우선 배정. (동학년 전담 없으면 오전:고학년, 오후:저학년 지원)
  2) 2시간 초과: 당일 전담시간 있는 교사가 고학년->저학년 순으로 배정.
  나. 2일 이상 수업결손 시
  1) 강사 미채용 시 교과전담 교사 우선 임시 담임 배정.
  2) 순서: 해당 학년 교과전담 -> 고학년 교과전담 순.
  `;
  
  const INITIAL_TEACHERS = [
    { id: 't1', name: '교무부장', grade: '관리자', class: '기타', count: 0 },
    { id: 't2', name: '1학년 1반', grade: '1학년', class: '1반', count: 1 },
    { id: 't3', name: '1학년 2반', grade: '1학년', class: '2반', count: 1 },
    { id: 't4', name: '2학년 1반', grade: '2학년', class: '1반', count: 2 },
    { id: 't5', name: '5학년 2반', grade: '5학년', class: '2반', count: 12 },
    { id: 't6', name: '6학년 2반', grade: '6학년', class: '2반', count: 5 },
    { id: 't7', name: '교담1', grade: '교과전담', class: '과학', count: 4 },
    { id: 't8', name: '교담2', grade: '교과전담', class: '영어', count: 3 },
    { id: 't9', name: '학습도움반', grade: '특수', class: '도움반', count: 12 },
  ];