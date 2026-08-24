/**
 * 채점 로직
 * - gradeNotifyText: 자유 텍스트 노티 ↔ requiredElements 키워드 매칭
 * - buildFollowUpQuestion / buildNotifyFollowUp: 누락 항목 의사 후속 질문
 * - calculateSBARSummary: 결과 화면용
 */

/**
 * 시나리오 requiredElements 길이에 비례한 되묻기 상한
 * (필수 항목 기준, 최대 6회)
 */
function getMaxFollowUps(requiredElements) {
  const list = Array.isArray(requiredElements) ? requiredElements : [];
  const requiredCount = list.filter((el) => el.required !== false).length;
  const n = requiredCount || list.length;
  return Math.min(Math.max(n - 1, 0), 6);
}

/** 활력·산소 통합 질문 대상 (scn_03 등) */
const VITAL_OXYGEN_FOLLOWUP_KEYS = ["SpO2수치", "호흡수", "산소요법현황"];

/** 항목별 의사 후속 질문 (없으면 keywords에서 자동 생성) */
const FOLLOW_UP_QUESTIONS = {
  환자식별: "몇 호실, 어떤 환자분이세요?",
  병실확인: "몇 호실이세요?",
  환자성명확인: "환자분 성함이 어떻게 되세요?",
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
 * 채점용 텍스트 정규화 (대소문자, SpO₂, 2 L 등)
 */
function normalizeNotifyText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/spo\s*[o０0]?\s*[₂2]/gi, "spo2")
    .replace(/₂/g, "2")
    .replace(/(\d)\s*l\b/gi, "$1l")
    .replace(/(\d)\s*리터/g, "$1리터")
    .replace(/\s+/g, " ")
    .trim();
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

/**
 * 자유 입력 노티 문장을 requiredElements 기준으로 채점
 */
function gradeNotifyText(text, requiredElements) {
  const normalized = normalizeNotifyText(text);
  const elements = Array.isArray(requiredElements) ? requiredElements : [];

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
 * SpO2 / RR / 산소요법 누락 조합 → 자연스러운 통합 질문
 */
function buildVitalOxygenFollowUp(missedKeys, oxygenItem) {
  const miss = new Set(missedKeys || []);
  const needSp = miss.has("SpO2수치");
  const needRr = miss.has("호흡수");
  const needO2 = miss.has("산소요법현황");

  const deviceOk = Boolean(
    oxygenItem?.groupSatisfied && oxygenItem.groupSatisfied[0]
  );
  const flowOk = Boolean(
    oxygenItem?.groupSatisfied && oxygenItem.groupSatisfied[1]
  );

  if (!needSp && !needRr && needO2) {
    if (deviceOk && !flowOk) return "몇 리터로 적용 중이에요?";
    if (!deviceOk && flowOk) return "비강캐뉼라로 하고 있는 건가요?";
    return "산소는 어떤 걸로 몇 리터 하고 있어요?";
  }

  if (needSp && needRr && needO2) {
    return "지금 바이탈하고 산소는 어떻게 하고 있어요?";
  }
  if (!needSp && needRr && needO2) {
    return "호흡수랑 현재 산소 적용 상태는요?";
  }
  if (needSp && !needRr && needO2) {
    return "산소포화도랑 현재 산소 적용 상태는요?";
  }
  if (needSp && needRr && !needO2) {
    return "현재 산소포화도와 호흡수는요?";
  }
  if (!needSp && needRr && !needO2) return "호흡수는요?";
  if (needSp && !needRr && !needO2) return "산소포화도는요?";
  return "지금 바이탈하고 산소는 어떻게 하고 있어요?";
}

/**
 * 누락 항목 → 의사 후속 질문 (단일)
 */
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
function buildNotifyFollowUp(grade, missed, elements) {
  const list = missed || [];
  if (!list.length) return null;

  const vitalMissed = list.filter((m) =>
    VITAL_OXYGEN_FOLLOWUP_KEYS.includes(m.key)
  );
  const otherMissed = list.filter(
    (m) => !VITAL_OXYGEN_FOLLOWUP_KEYS.includes(m.key)
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

  const oxygenItem = (grade?.checklist || []).find(
    (c) => c.key === "산소요법현황"
  );
  const keys = vitalMissed.map((m) => m.key);
  return {
    question: buildVitalOxygenFollowUp(keys, oxygenItem),
    askedKeysToAdd: [],
    targets: vitalMissed
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
