/**
 * 채점 로직
 * - gradeNotifyText: 자유 텍스트 노티 ↔ requiredElements 키워드 매칭
 * - buildFollowUpQuestion: 누락 항목에 대한 의사 후속 질문 생성
 * - calculateSBARSummary: 결과 화면용
 */

const MAX_NOTIFY_FOLLOWUPS = 3;

/** 항목별 의사 후속 질문 (없으면 keywords에서 자동 생성) */
const FOLLOW_UP_QUESTIONS = {
  환자식별: "몇 호실, 어떤 환자분이세요?",
  현재상황: "지금 상황이 어떻게 되나요?",
  발생시각: "언제부터 그랬어요?",
  항응고배경: "항응고제 복용 여부는요?",
  의식및증상: "의식 상태랑 증상은요?",
  활력징후: "혈압이랑 맥박은요?",
  활력징후변화: "활력징후 변화는요?",
  흉통양상: "흉통 양상이 어떤가요?",
  심전도확인: "ECG는 확인하셨어요?",
  SpO2수치: "산소포화도는요?",
  호흡수: "호흡수는요?",
  산소요법현황: "지금 산소는 몇 리터예요?",
  체온수치: "체온은 몇 도예요?",
  감염징후: "CRP나 WBC는요?",
  혈당수치: "혈당은요?",
  의식상태: "의식 상태는요?",
  증상: "동반 증상은요?",
  수혈반응증상: "어떤 증상이 있나요?",
  조치사항: "지금까지 어떤 조치 하셨어요?",
  요청사항: "어떤 처치 요청하실 건가요?"
};

/**
 * 자유 입력 노티 문장을 requiredElements 기준으로 채점
 * keywords 중 하나라도 포함되면 해당 항목 hit
 *
 * @param {string} text
 * @param {Array<{key:string,sbarCategory:string,keywords:string[],hint:string,passHint?:string}>} requiredElements
 */
function gradeNotifyText(text, requiredElements) {
  const normalized = String(text || "").toLowerCase();
  const elements = Array.isArray(requiredElements) ? requiredElements : [];

  const checklist = elements.map((el) => {
    const keywords = el.keywords || [];
    const matchedKeywords = keywords.filter((kw) =>
      normalized.includes(String(kw).toLowerCase())
    );
    const included = matchedKeywords.length > 0;
    return {
      key: el.key,
      sbarCategory: el.sbarCategory,
      hint: el.hint || "",
      passHint: el.passHint || "",
      matchedKeywords,
      included
    };
  });

  const includedCount = checklist.filter((c) => c.included).length;
  const total = checklist.length;

  const sbarScore = { S: 0, B: 0, A: 0, R: 0 };
  checklist.forEach((c) => {
    const cat = c.sbarCategory;
    if (c.included && sbarScore[cat] !== undefined) {
      sbarScore[cat] = 1;
    }
  });

  return {
    checklist,
    includedCount,
    total,
    ratio: total ? includedCount / total : 0,
    sbarScore
  };
}

/**
 * 아직 묻지 않은 누락 항목
 */
function getMissedForFollowUp(grade, askedKeys) {
  const asked = askedKeys || [];
  return (grade?.checklist || []).filter((c) => !c.included && !asked.includes(c.key));
}

/**
 * 누락 항목 → 의사 후속 질문
 */
function buildFollowUpQuestion(element) {
  if (!element) return "그 부분 다시 말씀해 주시겠어요?";
  if (element.followUpQuestion) return element.followUpQuestion;

  if (FOLLOW_UP_QUESTIONS[element.key]) {
    return FOLLOW_UP_QUESTIONS[element.key];
  }

  const kw = (element.keywords || []).find((k) => String(k).length >= 2);
  if (kw) return `${kw}는요?`;

  return `${element.key} 말씀해 주시겠어요?`;
}

function explainChecklistItem(item) {
  if (item.included) {
    if (item.passHint) return item.passHint;
    const matched = (item.matchedKeywords || []).slice(0, 3);
    if (matched.length) {
      return `잘 포함되었습니다. (확인: ${matched.join(", ")})`;
    }
    return "이 항목에 해당하는 내용이 노티에 포함되어 있습니다.";
  }
  return item.hint || "이 항목이 노티에서 빠져 있습니다.";
}

/**
 * 여러 시나리오 답변의 SBAR 합산
 */
function calculateSBARSummary(answers) {
  const totals = { S: 0, B: 0, A: 0, R: 0 };
  (answers || []).forEach((a) => {
    if (!a || !a.sbarScore) return;
    totals.S += a.sbarScore.S || 0;
    totals.B += a.sbarScore.B || 0;
    totals.A += a.sbarScore.A || 0;
    totals.R += a.sbarScore.R || 0;
  });
  return totals;
}
