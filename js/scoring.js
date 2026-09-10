/**
 * 채점 로직
 * - gradeNotifyText: 자유 텍스트 노티 ↔ requiredElements 키워드 매칭
 * - buildFollowUpQuestion / buildNotifyFollowUp: 누락 항목 의사 후속 질문
 * - calculateSBARSummary: 결과 화면용
 */

/**
 * 시나리오 requiredElements 길이에 비례한 되묻기 상한
 * (필수 항목 기준, 기본 최대 6회 / scn_06 그룹 항목 시 10회)
 */
function getMaxFollowUps(requiredElements) {
  const list = Array.isArray(requiredElements) ? requiredElements : [];
  const requiredCount = list.filter((el) => el.required !== false).length;
  const n = requiredCount || list.length;
  const hasScn06Groups = list.some(
    (el) => el.key === "수혈전후활력징후" || el.key === "수혈진행정보"
  );
  const cap = hasScn06Groups ? 10 : 6;
  return Math.min(Math.max(n - 1, 0), cap);
}

/** scn_03 전용: 활력징후(1요소) → 산소요법 순서로 질문 */
const SCN03_VITAL_KEY = "활력징후";
const SCN03_OXYGEN_KEY = "산소요법현황";
/** scn_06 전용: 수혈 전후 바이탈 · 수혈 진행정보 그룹 질문 */
const SCN06_VITAL_KEY = "수혈전후활력징후";
const SCN06_PROGRESS_KEY = "수혈진행정보";
const SCN03_VITAL_LABELS = [
  { i: 0, ask: "혈압" },
  { i: 1, ask: "맥박" },
  { i: 2, ask: "호흡수" },
  { i: 3, ask: "체온" },
  { i: 4, ask: "산소포화도" }
];

/** 항목별 의사 후속 질문 (없으면 keywords에서 자동 생성) */
const FOLLOW_UP_QUESTIONS = {
  환자식별: "몇 호실, 어떤 환자분이세요?",
  병실확인: "몇 호실이세요?",
  환자성명확인: "환자분 성함이 어떻게 되세요?",
  현재상황: "지금 상황이 어떻게 되나요?",
  발생시각: "언제부터 그랬어요?",
  항응고배경: "항응고제 복용 여부는요?",
  의식및증상: "의식 상태랑 증상은요?",
  활력징후: "지금 바이탈하고 산소포화도는 어떻게 돼요?",
  활력징후변화: "활력징후 변화는요?",
  수혈전후활력징후: "수혈 전후 바이탈 비교해서 알려주세요.",
  수혈진행정보: "수혈은 몇 시에 시작했고 지금까지 얼마나 들어갔어요?",
  수혈중단: "수혈은 바로 중단했어요?",
  혈액제제종류: "무슨 혈액 주고 있었어요?",
  생리식염수유지: "라인은 생리식염수로 유지 중이에요?",
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
 * 채점용 텍스트 정규화 (대소문자, SpO₂, 2 L 등)
 */
function normalizeNotifyText(text) {
  let t = String(text || "").toLowerCase();

  // SpO₂ / SpO2
  t = t.replace(/spo\s*[o０0]?\s*[₂2]/gi, "spo2");
  t = t.replace(/₂/g, "2");
  t = t.replace(/ℓ/g, "l");

  // 산소 장치: nasal prong/cannula, 비강캐뉼라, N-P/N/P/NP/NC → np
  t = t.replace(/nasal\s*prongs?/g, "np");
  t = t.replace(/nasal\s*cannulas?/g, "np");
  t = t.replace(/비강\s*캐뉼라/g, "np");
  t = t.replace(/비강\s*카테터/g, "np");
  t = t.replace(/코줄/g, "np");
  t = t.replace(/\bnc\b/g, "np");
  t = t.replace(/\bn[\s\-./]*p\b/g, "np");
  t = t.replace(/n[\-./]\s*p/g, "np");

  // 유량 2L 변형 → 2l
  t = t.replace(/분당\s*2\s*리터/g, "2l");
  t = t.replace(/2\s*l\s*\/\s*min/g, "2l");
  t = t.replace(/2\s*liters?\b/g, "2l");
  t = t.replace(/(\d)\s*l\b/g, "$1l");
  t = t.replace(/(\d)\s*리터/g, "$1l");

  // 주입량 ml/cc
  t = t.replace(/(\d+)\s*m\s*l\b/gi, "$1ml");
  t = t.replace(/(\d+)\s*cc\b/gi, "$1ml");
  t = t.replace(/(\d+)\s*씨씨/g, "$1ml");

  t = t.replace(/\s+/g, " ").trim();
  return t;
}

function normalizeKeyword(kw) {
  return normalizeNotifyText(kw);
}

function isElementRequired(el) {
  if (!el) return true;
  if (el.required === false) return false;
  if (el.optional === true) return false;
  return true;
}

/** 되묻기 직후 짧은 확인/부정 응답 판별용 */
function normalizeConfirmReply(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[.!?。！？~,，、]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const AFFIRMATIVE_REPLIES = new Set([
  "네",
  "예",
  "응",
  "어",
  "네네",
  "예예",
  "맞아요",
  "맞습니다",
  "맞음",
  "맞아",
  "그렇습니다",
  "그렇죠",
  "그래요",
  "그럼요",
  "그래",
  "했어요",
  "했습니다",
  "네 맞아요",
  "예 맞아요",
  "네 했어요",
  "예 했어요"
]);

const NEGATIVE_REPLIES = new Set([
  "아니요",
  "아니",
  "아뇨",
  "아닙니다",
  "아니에요",
  "안 했어요",
  "안했어요",
  "못 했어요",
  "못했어요",
  "못했습니다",
  "아직요",
  "아직 안 했어요"
]);

/**
 * 되묻기에 대한 짧은 긍정 응답인지
 * (시나리오 공통 — pendingFollowUpKey와 함께 사용)
 */
function isAffirmativeReply(text) {
  const t = normalizeConfirmReply(text);
  if (!t || t.length > 24) return false;
  return AFFIRMATIVE_REPLIES.has(t);
}

/**
 * 되묻기에 대한 짧은 부정 응답인지
 */
function isNegativeReply(text) {
  const t = normalizeConfirmReply(text);
  if (!t || t.length > 24) return false;
  if (NEGATIVE_REPLIES.has(t)) return true;
  return /^(아니|아뇨|아니요|아닙니다)/.test(t);
}

/**
 * 자유 입력 노티 문장을 requiredElements 기준으로 채점
 * @param {string} text
 * @param {Array} requiredElements
 * @param {{ forceIncludedKeys?: string[] }} [options]
 *        되묻기 긍정 확인으로 포함 처리할 element key 목록
 */
function gradeNotifyText(text, requiredElements, options) {
  const normalized = normalizeNotifyText(text);
  const elements = Array.isArray(requiredElements) ? requiredElements : [];
  const forceIncludedKeys = new Set(
    (options && options.forceIncludedKeys) || []
  );

  const checklist = elements.map((el) => {
    let matchedKeywords = [];
    let included = false;
    let groupSatisfied = null;

    if (Array.isArray(el.keywordGroups) && el.keywordGroups.length > 0) {
      const groupHits = el.keywordGroups.map((group) => {
        const list = Array.isArray(group) ? group : [];
        return list.filter((kw) => normalized.includes(normalizeKeyword(kw)));
      });
      groupSatisfied = groupHits.map((hits) => hits.length > 0);
      included = groupSatisfied.every(Boolean);
      matchedKeywords = groupHits.flat();
    } else {
      const keywords = el.keywords || [];
      matchedKeywords = keywords.filter((kw) =>
        normalized.includes(normalizeKeyword(kw))
      );
      included = matchedKeywords.length > 0;
    }

    if (forceIncludedKeys.has(el.key) && el.allowAffirmativeConfirmation === true) {
      included = true;
      if (Array.isArray(el.keywordGroups) && el.keywordGroups.length > 0) {
        groupSatisfied = el.keywordGroups.map(() => true);
      }
      if (!matchedKeywords.length) {
        matchedKeywords = ["확인응답"];
      }
    }

    const required = isElementRequired(el);
    return {
      key: el.key,
      sbarCategory: el.sbarCategory,
      hint: el.hint || "",
      passHint: el.passHint || "",
      rationale: el.rationale || "",
      required,
      optional: !required,
      matchedKeywords,
      groupSatisfied,
      included
    };
  });

  const requiredItems = checklist.filter((c) => c.required);
  const includedCount = requiredItems.filter((c) => c.included).length;
  const total = requiredItems.length;

  const sbarScore = { S: 0, B: 0, A: 0, R: 0 };
  checklist.forEach((c) => {
    const cat = c.sbarCategory;
    if (c.required && c.included && sbarScore[cat] !== undefined) {
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
 * 아직 묻지 않은 필수 누락 항목
 * - optional / required:false 제외
 * - R(권고)는 되묻기 제외 (기존 동작 유지)
 */
function getMissedForFollowUp(grade, askedKeys) {
  const asked = askedKeys || [];
  return (grade?.checklist || []).filter(
    (c) =>
      c.required &&
      !c.included &&
      !asked.includes(c.key) &&
      c.sbarCategory !== "R"
  );
}

/**
 * scn_03: 활력징후 그룹(BP·HR·RR·BT·SpO₂) 누락 → 한 문장 질문
 */
function buildScn03VitalFollowUp(groupSatisfied) {
  const sat = Array.isArray(groupSatisfied)
    ? groupSatisfied
    : [false, false, false, false, false];
  const missing = SCN03_VITAL_LABELS.filter((g) => !sat[g.i]);
  const present = SCN03_VITAL_LABELS.filter((g) => sat[g.i]);

  if (missing.length === 0) return null;
  if (present.length === 0) {
    return "지금 바이탈하고 산소포화도는 어떻게 돼요?";
  }

  // SpO₂만 답함
  if (present.length === 1 && sat[4]) {
    return "다른 바이탈은 어떻게 돼요?";
  }
  if (missing.length === 1) return missing[0].ask + "는요?";
  if (missing.length === 2) {
    return missing[0].ask + "하고 " + missing[1].ask + "는요?";
  }
  if (missing.length === 3) {
    return (
      missing[0].ask +
      "하고 " +
      missing[1].ask +
      "하고 " +
      missing[2].ask +
      "는요?"
    );
  }
  return "다른 바이탈은 어떻게 돼요?";
}

/**
 * scn_03: 산소요법 — 바이탈 완료 후 별도 질문
 */
function buildScn03OxygenFollowUp(oxygenItem, alreadyProbed) {
  const deviceOk = Boolean(
    oxygenItem?.groupSatisfied && oxygenItem.groupSatisfied[0]
  );
  const flowOk = Boolean(
    oxygenItem?.groupSatisfied && oxygenItem.groupSatisfied[1]
  );
  if (deviceOk && flowOk) return null;
  if (deviceOk && !flowOk) return "몇 리터로 하고 있어요?";
  if (!deviceOk && flowOk) return "어떤 장치로 하고 있어요?";
  if (alreadyProbed) return "어떤 장치로 몇 리터 하고 있어요?";
  return "지금 산소는 하고 있어요?";
}

/**
 * scn_06: 수혈 전후 활력징후 — 전/후 그룹 모두 필요
 */
function buildScn06VitalFollowUp(vitalItem) {
  const sat = Array.isArray(vitalItem?.groupSatisfied)
    ? vitalItem.groupSatisfied
    : [false, false];
  const preOk = Boolean(sat[0]);
  const curOk = Boolean(sat[1]);
  if (preOk && curOk) return null;
  if (curOk && !preOk) return "수혈 전 바이탈은 어땠어요?";
  if (preOk && !curOk) return "지금 바이탈은요?";
  return "수혈 전후 바이탈 비교해서 알려주세요.";
}

/**
 * scn_06: 수혈 진행정보 — 시작 시각 + 주입량
 */
function buildScn06ProgressFollowUp(progressItem) {
  const sat = Array.isArray(progressItem?.groupSatisfied)
    ? progressItem.groupSatisfied
    : [false, false];
  const startOk = Boolean(sat[0]);
  const volOk = Boolean(sat[1]);
  if (startOk && volOk) return null;
  if (startOk && !volOk) return "증상 생길 때까지 얼마나 들어갔어요?";
  if (!startOk && volOk) return "수혈은 몇 시에 시작했어요?";
  return "수혈은 몇 시에 시작했고 지금까지 얼마나 들어갔어요?";
}

function buildFollowUpQuestion(element) {
  if (!element) return "그 부분 다시 말씀해 주시겠어요?";
  if (element.followUpQuestion) return element.followUpQuestion;
  if (FOLLOW_UP_QUESTIONS[element.key]) return FOLLOW_UP_QUESTIONS[element.key];

  const kw = (element.keywords || []).find((k) => String(k).length >= 2);
  if (kw) return `${kw}는요?`;
  return `${element.key} 말씀해 주시겠어요?`;
}

/**
 * 되묻기 대상 선택 + 질문 생성
 * - SpO2/RR/산소가 함께 남아 있으면 한 번에 묶어 질문
 * - 활력·산소 그룹은 askedKeys에 넣지 않아 부분 답변 후 남은 것만 다시 물을 수 있음
 */
function buildNotifyFollowUp(grade, missed, elements, askedKeys) {
  const list = missed || [];
  if (!list.length) return null;

  const hasScn03Vital = (elements || []).some((e) => e.key === SCN03_OXYGEN_KEY) &&
    (elements || []).some((e) => e.key === SCN03_VITAL_KEY && e.keywordGroups?.length === 5);
  const hasScn06 = (elements || []).some((e) => e.key === SCN06_VITAL_KEY);
  const vitalMissed = list.find((m) => m.key === SCN03_VITAL_KEY);
  const oxygenMissed = list.find((m) => m.key === SCN03_OXYGEN_KEY);
  const scn06VitalMissed = list.find((m) => m.key === SCN06_VITAL_KEY);
  const scn06ProgressMissed = list.find((m) => m.key === SCN06_PROGRESS_KEY);
  const otherMissed = list.filter(
    (m) =>
      (!hasScn03Vital || m.key !== SCN03_VITAL_KEY) &&
      m.key !== SCN03_OXYGEN_KEY &&
      m.key !== SCN06_VITAL_KEY &&
      m.key !== SCN06_PROGRESS_KEY
  );

  if (otherMissed.length > 0) {
    const target = otherMissed[0];
    const sourceEl =
      (elements || []).find((e) => e.key === target.key) || target;
    return {
      question: buildFollowUpQuestion(sourceEl),
      askedKeysToAdd: [target.key],
      targets: [target]
    };
  }

  // scn_06: 중단 등 확인 후 → 전후 바이탈 → 수혈 진행정보
  if (hasScn06) {
    if (scn06VitalMissed) {
      const vitalItem = (grade?.checklist || []).find(
        (c) => c.key === SCN06_VITAL_KEY
      );
      return {
        question: buildScn06VitalFollowUp(vitalItem),
        askedKeysToAdd: [],
        targets: [scn06VitalMissed]
      };
    }
    if (scn06ProgressMissed) {
      const progressItem = (grade?.checklist || []).find(
        (c) => c.key === SCN06_PROGRESS_KEY
      );
      return {
        question: buildScn06ProgressFollowUp(progressItem),
        askedKeysToAdd: [],
        targets: [scn06ProgressMissed]
      };
    }
  }

  // scn_03 전용: 활력징후 그룹 → 산소요법 순서 (개별 SpO2/RR 질문 금지)
  if (hasScn03Vital) {
    if (vitalMissed) {
      const vitalItem = (grade?.checklist || []).find(
        (c) => c.key === SCN03_VITAL_KEY
      );
      return {
        question: buildScn03VitalFollowUp(vitalItem?.groupSatisfied),
        askedKeysToAdd: [],
        targets: [vitalMissed]
      };
    }
    if (oxygenMissed) {
      const oxygenItem = (grade?.checklist || []).find(
        (c) => c.key === SCN03_OXYGEN_KEY
      );
      const probed = (askedKeys || []).includes("__scn03_o2_probed__");
      return {
        question: buildScn03OxygenFollowUp(oxygenItem, probed),
        askedKeysToAdd: probed ? [] : ["__scn03_o2_probed__"],
        targets: [oxygenMissed]
      };
    }
  }

  const target = list[0];
  const sourceEl =
    (elements || []).find((e) => e.key === target.key) || target;
  return {
    question: buildFollowUpQuestion(sourceEl),
    askedKeysToAdd: [target.key],
    targets: [target]
  };
}

/**
 * S/B/A 되묻기 종료 후 의사 마무리 대사
 */
function buildDoctorClosingMessage(grade, elements, scenario) {
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

  return (
    scenario?.closingLineNoR ||
    "알겠습니다. 확인했으니 필요한 처치는 제가 상황 보고 판단해서 진행할게요."
  );
}

/**
 * 최종 피드백 — 필수 R 누락 안내 (선택 R은 soft tip)
 */
function getRecommendationMissNotice(grade, elements) {
  const rItem = (grade?.checklist || []).find((c) => c.sbarCategory === "R");
  if (!rItem || rItem.included) return null;
  if (!rItem.required) return null;

  const rEl = (elements || []).find((e) => e.sbarCategory === "R");
  const example = rEl?.hint || "구체적인 검사·처치 요청을 포함하세요.";
  return `권고사항(R)이 누락되었습니다 - 예시: ${example}`;
}

/**
 * 선택 R 참고 피드백
 */
function getOptionalRequestFeedback(grade) {
  const rItem = (grade?.checklist || []).find((c) => c.sbarCategory === "R");
  if (!rItem || rItem.required) return null;
  if (rItem.included) {
    return "필요한 조치까지 명확하게 요청했습니다.";
  }
  return "필요한 조치를 함께 요청하면 더욱 적극적인 노티가 됩니다.";
}

function explainChecklistItem(item) {
  if (item.included) {
    if (item.matchedKeywords?.length) {
      console.debug("[scoring] matchedKeywords", item.key, item.matchedKeywords);
    }
    if (item.passHint) return item.passHint;
    if (item.sbarCategory === "R" && item.optional) {
      return "필요한 조치까지 명확하게 요청했습니다.";
    }
    if (item.hint) {
      return `잘 포함되었습니다. (${item.hint})`;
    }
    return "이 항목에 해당하는 내용이 노티에 포함되어 있습니다.";
  }
  if (item.optional) {
    return (
      item.hint ||
      "필요한 조치를 함께 요청하면 더욱 적극적인 노티가 됩니다."
    );
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
