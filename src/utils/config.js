// 학교 기본 정보
export const SCHOOL_INFO = {
  NAME: "천안용암초등학교",
  VERSION: "v2.1 (Clean Start)",
};

// 환경 변수 로드 (Vite 방식)
export const ENV_CONFIG = {
  GEMINI_KEY: import.meta.env.VITE_GEMINI_KEY || "", 
};

// 보결 규정
export const SCHOOL_RULES = `
가. 1일 이하의 수업결손 시
1) 2시간 이하: 동학년 우선 배정. (동학년 전담 없으면 오전:고학년, 오후:저학년 지원)
2) 2시간 초과: 당일 전담시간 있는 교사가 고학년->저학년 순으로 배정.
나. 2일 이상 수업결손 시
1) 강사 미채용 시 교과전담 교사 우선 임시 담임 배정.
2) 순서: 해당 학년 교과전담 -> 고학년 교과전담 순.
`;

// [수정] 초기 데이터를 빈 배열로 변경하여 실제 학교 데이터만 등록되도록 함
export const INITIAL_TEACHERS = [];