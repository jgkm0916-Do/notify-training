/**
 * 채점 로직
 * - gradeNotifyText: 자유 텍스트 노티 ↔ requiredElements 키워드 매칭
 * - buildFollowUpQuestion: 누락 항목에 대한 의사 후속 질문 생성
 * - calculateSBARSummary: 결과 화면용
 */

/**
 * 시나리오 requiredElements 길이에 비례한 되묻기 상한
 * (R 제외 누락 항목 중 최대 6회까지)
 */
function getMaxFollowUps(requiredElements) {
  const list = Array.isArray(requiredElements) ? requiredElements : [];
  return Math.min(list.length - 1, 6);
}

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
 * @param {Array<{key:string,sbarCategory:string,keywords?:string[],keywordGroups?:string[][],hint:string,passHint?:string,rationale?:string}>} requiredElements
 */
function gradeNotifyText(text, requiredElements) {
  const normalized = String(text || "").toLowerCase();
  const elements = Array.isArray(requiredElements) ? requiredElements : [];

  const checklist = elements.map((el) => {
    let matchedKeywords = [];
    let included = false;

    if (Array.isArray(el.keywordGroups) && el.keywordGroups.length > 0) {
      // 각 그룹에서 최소 1개씩 매칭되어야 통과
      const groupHits = el.keywordGroups.map((group) => {
        const list = Array.isArray(group) ? group : [];
        return list.filter((kw) =>
          normalized.includes(String(kw).toLowerCase())
        );
      });
      included = groupHits.every((hits) => hits.length > 0);
      matchedKeywords = groupHits.flat();
    } else {
      // 기존: keywords 중 하나만 있어도 통과
      const keywords = el.keywords || [];
      matchedKeywords = keywords.filter((kw) =>
        normalized.includes(String(kw).toLowerCase())
      );
      included = matchedKeywords.length > 0;
    }

    return {
      key: el.key,
      sbarCategory: el.sbarCategory,
      hint: el.hint || "",
      passHint: el.passHint || "",
      rationale: el.rationale || "",
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
 * 아직 묻지 않은 누락 항목 (R 권고사항은 되묻기 제외)
 */
function getMissedForFollowUp(grade, askedKeys) {
  const asked = askedKeys || [];
  return (grade?.checklist || []).filter(
    (c) => !c.included && !asked.includes(c.key) && c.sbarCategory !== "R"
  );
}

/**
 * S/B/A 되묻기 종료 후 의사 마무리 대사
 */
function buildDoctorClosingMessage(grade, elements) {
  const rItem = (grade?.checklist || []).find((c) => c.sbarCategory === "R");

  if (rItem?.included) {
    const matched = rItem.matchedKeywords || [];
    if (matched.length >= 2) {
      return `네, ${matched.slice(0, 2).join("·")} 요청 확인했습니다. 그렇게 진행하겠습니다.`;
    }
    if (matched.length === 1) {
      return `네, ${matched[0]} 관련해서 확인했습니다. 진행하겠습니다.`;
    }
    return "네, 말씀하신 요청 확인했습니다. 진행하겠습니다.";
  }

  return "알겠습니다. 확인했으니 필요한 처치는 제가 상황 보고 판단해서 진행할게요.";
}

/**
 * 최종 피드백 — R 누락 안내 문구
 */
function getRecommendationMissNotice(grade, elements) {
  const rItem = (grade?.checklist || []).find((c) => c.sbarCategory === "R");
  if (!rItem || rItem.included) return null;

  const rEl = (elements || []).find((e) => e.sbarCategory === "R");
  const example = rEl?.hint || "구체적인 검사·처치 요청을 포함하세요.";
  return `권고사항(R)이 누락되었습니다 - 예시: ${example}`;
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
    if (item.matchedKeywords?.length) {
      console.debug("[scoring] matchedKeywords", item.key, item.matchedKeywords);
    }
    if (item.passHint) return item.passHint;
    if (item.hint) {
      return `잘 포함되었습니다. (${item.hint})`;
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
