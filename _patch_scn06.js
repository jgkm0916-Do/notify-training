const fs = require("fs");

const dataPath = "D:/DATA/Desktop/notify training/js/data.js";
const scoringPath = "D:/DATA/Desktop/notify training/js/scoring.js";

let data = fs.readFileSync(dataPath, "utf8");

const oldScn06Block = `    chartData: {
      VS: { BP: "105/70 (수혈 전 120/80)", HR: "105", RR: "22", BT: "38.0 (수혈 전 36.8)", SpO2: "96%" },
      Lab: "오늘 15:30 수혈 전 시행 - Hb 6.8 g/dL",
      Meds: ["PRBC 1 pint 수혈중"],
      IO: { intake: "정상", output: "정상" },
      Symptoms: "오한, 두드러기, 가려움증, 요통 호소",
      Treatment: "수혈 즉시 중단, 생리식염수로 라인 유지중"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["1005"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: [
          "임현수",
          "임현수님",
          "임현수 환자",
          "임현수 환자분",
          "1005호 임현수"
        ],
        hint: "환자 성명을 말하세요.",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "환자 성명을 확인해야 다른 환자와 혼동하는 것을 예방할 수 있습니다."
      },
      {
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["16:45", "4시 45", "16시", "15분"],
        hint: "증상 발생 시각(16:45) 또는 수혈 시작 후 경과 시간을 포함하세요.",
        rationale: "발생 시각·수혈 후 경과시간은 급성 수혈 반응 가능성과 보고 시점을 판단하는 기준입니다."
      },
      {
        key: "수혈반응증상",
        sbarCategory: "S",
        keywords: ["오한", "두드러기", "발진", "가려움"],
        hint: "수혈 반응의 구체적 증상이 핵심 정보입니다.",
        rationale: "오한·두드러기 등 구체 증상은 수혈 반응 유형을 추정하는 첫 근거입니다."
      },
      {
        key: "활력징후변화",
        sbarCategory: "A",
        keywords: ["체온", "38.0", "혈압", "BP"],
        hint: "수혈 전후 활력징후 변화가 평가(A)에 필요합니다.",
        rationale: "수혈 전후 체온·혈압 변화는 반응 중증도를 객관적으로 보여 줍니다."
      },
      {
        key: "조치사항",
        sbarCategory: "B",
        keywords: ["중단", "중지", "멈춤", "스탑", "라인 잠금", "클램프"],
        hint: "수혈 즉시 중단 여부",
        followUpQuestion: "수혈은 중단하셨어요?",
        rationale: "수혈 부작용 의심 시 원인 확인보다 즉시 중단이 우선입니다. 중단 없이 보고하면 의사가 반응이 계속되는 줄 모른 채 판단하게 됩니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["처방", "요청", "봐주세요"],
        hint: "다음 조치를 명확히 요청해야 합니다.",
        rationale: "원하는 다음 조치를 명시해야 의사가 즉시 처방·방문 여부를 결정할 수 있습니다."
      }
    ]
  }
];`;

const newScn06Block = `    chartData: {
      VS: {
        "수혈 전": "BP 120/80, BT 36.8",
        "현재": "BP 105/70, HR 105, RR 22, BT 38.0, SpO2 96%"
      },
      Lab: "오늘 15:30 수혈 전 시행 - Hb 6.8 g/dL",
      Meds: [
        "PRBC 1 pint",
        "수혈 시작 16:30",
        "증상 발생(16:45) 시점까지 약 50mL 주입"
      ],
      IO: { intake: "정상", output: "정상" },
      Symptoms: "오한, 두드러기, 가려움증, 요통 호소",
      Treatment: "수혈 즉시 중단, 생리식염수로 라인 유지중"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["1005"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: [
          "임현수",
          "임현수님",
          "임현수 환자",
          "임현수 환자분",
          "1005호 임현수"
        ],
        hint: "환자 성명을 말하세요.",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "환자 성명을 확인해야 다른 환자와 혼동하는 것을 예방할 수 있습니다."
      },
      {
        key: "수혈반응증상",
        sbarCategory: "S",
        keywords: ["오한", "두드러기", "발진", "가려움", "요통"],
        hint: "수혈 반응의 구체적 증상이 핵심 정보입니다.",
        followUpQuestion: "어떤 증상이 있나요?",
        rationale: "오한·두드러기 등 구체 증상은 수혈 반응 유형을 추정하는 첫 근거입니다."
      },
      {
        key: "수혈중단",
        sbarCategory: "B",
        keywords: ["중단", "중지", "멈춤", "스탑", "라인 잠금", "클램프"],
        hint: "수혈 즉시 중단 여부",
        followUpQuestion: "수혈은 바로 중단했어요?",
        rationale: "수혈 부작용 의심 시 원인 확인보다 즉시 중단이 우선입니다. 중단 없이 보고하면 의사가 반응이 계속되는 줄 모른 채 판단하게 됩니다."
      },
      {
        key: "수혈전후활력징후",
        sbarCategory: "A",
        keywordGroups: [
          ["120/80", "120／80", "수혈 전 120", "전 120/80", "36.8"],
          ["105/70", "105／70", "38.0", "38도", "spo2 96", "96%"]
        ],
        hint: "수혈 전·현재 활력징후를 수치로 비교해 전달하세요.",
        passHint:
          "수혈 전 BP 120/80·BT 36.8 → 현재 BP 105/70·BT 38.0(상승)·HR 105 등 변화를 비교해 전달했습니다.",
        followUpQuestion: "수혈 전후 바이탈 비교해서 알려주세요.",
        rationale:
          "수혈 전후 혈압·체온 등 수치 비교가 있어야 반응 중증도(혈압 저하·체온 상승 등)를 객관적으로 판단할 수 있습니다."
      },
      {
        key: "혈액제제종류",
        sbarCategory: "B",
        keywords: ["PRBC", "prbc", "적혈구", "농축적혈구", "packed"],
        hint: "투여 중인 혈액제제 종류(PRBC)",
        followUpQuestion: "무슨 혈액 주고 있었어요?",
        rationale: "혈액제제 종류를 알아야 급성 용혈·알레르기 등 반응 유형을 좁힐 수 있습니다."
      },
      {
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["16:45", "4시 45", "16시 45", "15분", "십오분"],
        hint: "증상 발생 시각(16:45) 또는 수혈 시작 후 경과 시간(15분)",
        followUpQuestion: "증상은 언제부터였어요?",
        rationale: "발생 시각·수혈 후 경과시간은 급성 수혈 반응 가능성과 보고 시점을 판단하는 기준입니다."
      },
      {
        key: "수혈진행정보",
        sbarCategory: "B",
        keywordGroups: [
          ["16:30", "4시 30", "16시 30", "4:30"],
          ["50ml", "50 ml", "50mL", "50cc", "50씨씨", "50cc"]
        ],
        hint: "수혈 시작 시각(16:30)과 증상 발생 시점까지 주입량(50mL)",
        followUpQuestion: "수혈은 몇 시에 시작했고 지금까지 얼마나 들어갔어요?",
        rationale:
          "시작 시각과 주입량이 있어야 반응 시점·노출량을 파악하고 이후 처치 계획을 세울 수 있습니다."
      },
      {
        key: "생리식염수유지",
        sbarCategory: "B",
        keywords: ["생리식염수", "생리 식염수", "N/S", "NS", "노말살린", "라인 유지", "정맥로"],
        hint: "생리식염수로 정맥로 유지 여부",
        followUpQuestion: "라인은 생리식염수로 유지 중이에요?",
        rationale: "수혈 중단 후 정맥로를 생리식염수로 유지해야 추가 처치·수액 투여가 가능합니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["처방", "요청", "봐주세요"],
        hint: "다음 조치를 명확히 요청해야 합니다.",
        rationale: "원하는 다음 조치를 명시해야 의사가 즉시 처방·방문 여부를 결정할 수 있습니다."
      }
    ]
  }
];`;

if (!data.includes(oldScn06Block)) {
  console.error("scn_06 block not found exactly");
  process.exit(1);
}
data = data.replace(oldScn06Block, newScn06Block);
fs.writeFileSync(dataPath, data);
console.log("data.js scn_06 updated");

let scoring = fs.readFileSync(scoringPath, "utf8");

// bump follow-up cap when scn_06 group keys present
scoring = scoring.replace(
  `function getMaxFollowUps(requiredElements) {
  const list = Array.isArray(requiredElements) ? requiredElements : [];
  const requiredCount = list.filter((el) => el.required !== false).length;
  const n = requiredCount || list.length;
  return Math.min(Math.max(n - 1, 0), 6);
}`,
  `function getMaxFollowUps(requiredElements) {
  const list = Array.isArray(requiredElements) ? requiredElements : [];
  const requiredCount = list.filter((el) => el.required !== false).length;
  const n = requiredCount || list.length;
  const hasScn06Groups = list.some(
    (el) => el.key === "수혈전후활력징후" || el.key === "수혈진행정보"
  );
  const cap = hasScn06Groups ? 10 : 6;
  return Math.min(Math.max(n - 1, 0), cap);
}`
);

// add constants after SCN03_OXYGEN
if (!scoring.includes("SCN06_VITAL_KEY")) {
  scoring = scoring.replace(
    `const SCN03_OXYGEN_KEY = "산소요법현황";`,
    `const SCN03_OXYGEN_KEY = "산소요법현황";
/** scn_06 전용: 수혈 전후 바이탈 · 수혈 진행정보 그룹 질문 */
const SCN06_VITAL_KEY = "수혈전후활력징후";
const SCN06_PROGRESS_KEY = "수혈진행정보";`
  );
}

// update FOLLOW_UP map
scoring = scoring.replace(
  `  활력징후변화: "활력징후 변화는요?",`,
  `  활력징후변화: "활력징후 변화는요?",
  수혈전후활력징후: "수혈 전후 바이탈 비교해서 알려주세요.",
  수혈진행정보: "수혈은 몇 시에 시작했고 지금까지 얼마나 들어갔어요?",
  수혈중단: "수혈은 바로 중단했어요?",
  혈액제제종류: "무슨 혈액 주고 있었어요?",
  생리식염수유지: "라인은 생리식염수로 유지 중이에요?",`
);

scoring = scoring.replace(
  `  조치사항: "지금까지 어떤 조치 하셨어요?",`,
  `  조치사항: "지금까지 어떤 조치 하셨어요?",
  수혈반응증상: "어떤 증상이 있나요?",`
);

// remove duplicate 수혈반응증상 if we doubled - check later

// volume normalize helpers
scoring = scoring.replace(
  `  t = t.replace(/(\\d)\\s*리터/g, "$1l");

  t = t.replace(/\\s+/g, " ").trim();
  return t;
}`,
  `  t = t.replace(/(\\d)\\s*리터/g, "$1l");

  // 주입량 ml/cc
  t = t.replace(/(\\d+)\\s*m\\s*l\\b/gi, "$1ml");
  t = t.replace(/(\\d+)\\s*cc\\b/gi, "$1ml");
  t = t.replace(/(\\d+)\\s*씨씨/g, "$1ml");

  t = t.replace(/\\s+/g, " ").trim();
  return t;
}`
);

const scn06Helpers = `
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
`;

if (!scoring.includes("buildScn06VitalFollowUp")) {
  scoring = scoring.replace(
    `function buildFollowUpQuestion(element) {`,
    scn06Helpers + `\nfunction buildFollowUpQuestion(element) {`
  );
}

// Update buildNotifyFollowUp to handle scn_06 groups
const oldBuild = `function buildNotifyFollowUp(grade, missed, elements, askedKeys) {
  const list = missed || [];
  if (!list.length) return null;

  const hasScn03Vital = (elements || []).some((e) => e.key === SCN03_VITAL_KEY);
  const vitalMissed = list.find((m) => m.key === SCN03_VITAL_KEY);
  const oxygenMissed = list.find((m) => m.key === SCN03_OXYGEN_KEY);
  const otherMissed = list.filter(
    (m) => m.key !== SCN03_VITAL_KEY && m.key !== SCN03_OXYGEN_KEY
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
}`;

const newBuild = `function buildNotifyFollowUp(grade, missed, elements, askedKeys) {
  const list = missed || [];
  if (!list.length) return null;

  const hasScn03Vital = (elements || []).some((e) => e.key === SCN03_VITAL_KEY);
  const hasScn06 = (elements || []).some((e) => e.key === SCN06_VITAL_KEY);
  const vitalMissed = list.find((m) => m.key === SCN03_VITAL_KEY);
  const oxygenMissed = list.find((m) => m.key === SCN03_OXYGEN_KEY);
  const scn06VitalMissed = list.find((m) => m.key === SCN06_VITAL_KEY);
  const scn06ProgressMissed = list.find((m) => m.key === SCN06_PROGRESS_KEY);
  const otherMissed = list.filter(
    (m) =>
      m.key !== SCN03_VITAL_KEY &&
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
}`;

if (!scoring.includes(oldBuild)) {
  console.error("buildNotifyFollowUp block not found");
  process.exit(1);
}
scoring = scoring.replace(oldBuild, newBuild);

// fix possible duplicate 수혈반응증상 in FOLLOW_UP
const dup = scoring.match(/수혈반응증상:/g);
if (dup && dup.length > 1) {
  // remove the one we added after 조치사항 if original exists
  scoring = scoring.replace(
    `\n  수혈반응증상: "어떤 증상이 있나요?",\n  요청사항:`,
    `\n  요청사항:`
  );
}

fs.writeFileSync(scoringPath, scoring);
console.log("scoring.js updated");

// cache bump
for (const f of ["scenario.html", "index.html"]) {
  const p = "D:/DATA/Desktop/notify training/" + f;
  let h = fs.readFileSync(p, "utf8");
  h = h.replace(/data\.js\?v=\d+/, "data.js?v=10");
  h = h.replace(/scoring\.js(\?v=\d+)?/, "scoring.js?v=10");
  fs.writeFileSync(p, h);
}
console.log("cache v=10");
