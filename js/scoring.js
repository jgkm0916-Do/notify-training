/**
 * 채점 로직
 * - gradeNotifyText: 자유 텍스트 노티 ↔ requiredElements 키워드 매칭
 * - calculatePreparedness / calculateSBARSummary: 결과 화면용
 */

/**
 * 자유 입력 노티 문장을 requiredElements 기준으로 채점
 * keywords 중 하나라도 포함되면 해당 항목 hit
 *
 * @param {string} text
 * @param {Array<{key:string,sbarCategory:string,keywords:string[],hint:string}>} requiredElements
 * @returns {{
 *   checklist: Array<{key:string,sbarCategory:string,hint:string,included:boolean}>,
 *   includedCount: number,
 *   total: number,
 *   ratio: number,
 *   sbarScore: {S:number,B:number,A:number,R:number}
 * }}
 */
function gradeNotifyText(text, requiredElements) {
  const normalized = String(text || "").toLowerCase();
  const elements = Array.isArray(requiredElements) ? requiredElements : [];

  const checklist = elements.map((el) => {
    const keywords = el.keywords || [];
    const included = keywords.some((kw) =>
      normalized.includes(String(kw).toLowerCase())
    );
    return {
      key: el.key,
      sbarCategory: el.sbarCategory,
      hint: el.hint,
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
 * 사전 차트 준비도
 * @param {object} scenario
 * @param {string[]} checkedCategories
 */
function calculatePreparedness(scenario, checkedCategories) {
  const required = scenario.requiredCategories || [];
  const checked = required.filter((c) => checkedCategories.includes(c));
  return {
    ratio: required.length ? checked.length / required.length : 0,
    missed: required.filter((c) => !checkedCategories.includes(c)),
    checkedCount: checked.length,
    requiredCount: required.length
  };
}

/**
 * 여러 시나리오 답변의 SBAR 합산
 * @param {Array<{sbarScore:{S:number,B:number,A:number,R:number}}>} answers
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
