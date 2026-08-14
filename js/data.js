/**
 * 시나리오 데이터
 * - patient: 호실·이름·진단명·(선택)수술 후 경과일
 * - chartData / requiredElements
 */
const scenarios = [
  {
    id: "scn_01",
    title: "낙상 발생 노티",
    subtitle: "야간 근무 중 침상 낙상 발견",
    partnerName: "김민수",
    partnerRole: "의사",
    trigger: "802호 김OO님 침상에서 낙상, 신규간호사인 당신이 발견",

    patient: {
      room: "802호",
      name: "김OO",
      ageSex: "78세/F",
      diagnosis: "심방세동",
      pod: null
    },

    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "03:12" }
    ],

    chartData: {
      VS: { BP: "128/76", HR: "88", RR: "18", BT: "36.7", SpO2: "97%" },
      Lab: { "최근 CBC": "정상범위", "최근 PT/INR": "1.4 (항응고제 복용중)" },
      Meds: ["와파린 5mg qd", "아스피린 100mg qd"],
      IO: { intake: "1200ml", output: "900ml" },
      Symptoms: "낙상 후 후두부 통증 호소, 의식 명료, 구토 없음",
      Treatment: "낙상 직후 활력징후 측정 완료, 냉찜질 적용"
    },

    requiredElements: [
      {
        key: "환자식별",
        sbarCategory: "S",
        keywords: ["802", "김", "심방세동"],
        hint: "병실·환자명과 진단명(심방세동)을 함께 포함하세요."
      },
      {
        key: "현재상황",
        sbarCategory: "S",
        keywords: ["낙상", "넘어"],
        hint: "현재 상황(침상 낙상)을 명확히 전달하세요."
      },
      {
        key: "항응고배경",
        sbarCategory: "B",
        keywords: ["와파린", "항응고", "INR", "1.4", "아스피린"],
        hint: "항응고제 복용 또는 PT/INR 등 관련 배경을 포함하세요."
      },
      {
        key: "의식및증상",
        sbarCategory: "A",
        keywords: ["의식", "명료", "후두부", "두통", "통증", "구토"],
        hint: "의식 상태와 두통/후두부 통증 등 평가 내용을 포함하세요."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywords: ["128", "76", "BP", "혈압", "88", "HR", "심박"],
        hint: "측정한 활력징후 수치(BP, HR 등)를 포함하세요."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["CT", "처방", "방문", "확인", "요청", "부탁", "지시"],
        hint: "의사에게 원하는 검사·처치·방문을 구체적으로 요청하세요."
      }
    ]
  },

  {
    id: "scn_02",
    title: "흉통 노티",
    partnerName: "박준호",
    partnerRole: "의사",
    trigger: "701호 박OO님(65세, M) 갑작스러운 흉통 호소, 좌측 방사통 동반",
    patient: {
      room: "701호",
      name: "박OO",
      ageSex: "65세/M",
      diagnosis: "불안정성 협심증 의증",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "03:12" }
    ],
    chartData: {
      VS: { BP: "150/95", HR: "102", RR: "22", BT: "36.8", SpO2: "95%" },
      Lab: { Troponin: "결과 대기중", 과거력: "고혈압, 당뇨" },
      Meds: ["아스피린 100mg qd", "메트포르민 500mg bid"],
      IO: { intake: "800ml", output: "700ml" },
      Symptoms: "흉통 NRS 7/10, 좌측 어깨 방사통, 식은땀, 호흡곤란 동반",
      Treatment: "ECG 모니터링 중, NTG 설하정 투여 전"
    },
    requiredElements: [
      { key: "환자식별", sbarCategory: "S", keywords: ["701호", "박OO", "박○○", "협심증"], hint: "병실·환자명과 진단명(협심증 의증)을 함께 말하세요." },
      { key: "흉통양상", sbarCategory: "S", keywords: ["흉통", "방사통", "NRS"], hint: "통증 양상과 강도가 빠지면 심각도 판단이 어렵습니다." },
      { key: "활력징후", sbarCategory: "A", keywords: ["혈압", "BP", "150", "심박", "HR"], hint: "구체적 수치가 없으면 상태 평가가 전달되지 않습니다." },
      { key: "심전도확인", sbarCategory: "A", keywords: ["ECG", "심전도"], hint: "흉통 시 ECG 확인 여부는 필수 보고 항목입니다." },
      { key: "요청사항", sbarCategory: "R", keywords: ["처방", "요청", "봐주세요", "와주세요", "투약", "NTG", "할까요", "확인", "지시", "부탁"], hint: "무엇을 원하는지 명확히 요청해야 합니다. (예: NTG 투약할까요?)" }
    ]
  },

  {
    id: "scn_03",
    title: "호흡곤란 노티",
    partnerName: "이서연",
    partnerRole: "의사",
    trigger: "903호 이OO님(80세, COPD) 갑자기 호흡곤란 호소, SpO2 88%로 저하",
    patient: {
      room: "903호",
      name: "이OO",
      ageSex: "80세/F",
      diagnosis: "COPD",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "03:12" }
    ],
    chartData: {
      VS: { BP: "130/80", HR: "118", RR: "30", BT: "37.0", SpO2: "88% (비강캐뉼라 2L 적용중)" },
      Lab: { ABGA: "미시행", 과거력: "COPD 10년" },
      Meds: ["기관지확장제 흡입기 qid"],
      IO: { intake: "1000ml", output: "950ml" },
      Symptoms: "호흡곤란, 좌위호흡, 청색증 의심",
      Treatment: "산소 2L → 4L 상향 적용, 기도흡인 시행"
    },
    requiredElements: [
      { key: "환자식별", sbarCategory: "S", keywords: ["903호", "이OO", "이○○", "COPD"], hint: "병실·환자명과 진단명(COPD)을 함께 말하세요." },
      { key: "SpO2수치", sbarCategory: "S", keywords: ["88", "산소포화도", "SpO2"], hint: "구체적 산소포화도 수치가 핵심 정보입니다." },
      { key: "호흡수", sbarCategory: "A", keywords: ["호흡수", "RR", "30"], hint: "호흡수 변화는 상태 평가에 필수입니다." },
      { key: "산소요법현황", sbarCategory: "B", keywords: ["산소", "리터", "L", "캐뉼라"], hint: "현재 적용 중인 산소요법 정보가 빠지면 의사가 조치를 판단하기 어렵습니다." },
      { key: "요청사항", sbarCategory: "R", keywords: ["처방", "요청", "봐주세요", "와주세요"], hint: "다음 조치를 명확히 요청해야 합니다." }
    ]
  },

  {
    id: "scn_04",
    title: "발열 노티",
    partnerName: "최유진",
    partnerRole: "의사",
    trigger: "605호 최OO님(55세) 발열 및 오한 호소, 최근 요로감염 병력",
    patient: {
      room: "605호",
      name: "최OO",
      ageSex: "55세/F",
      diagnosis: "요로감염",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "03:12" }
    ],
    chartData: {
      VS: { BP: "100/60", HR: "110", RR: "24", BT: "39.2", SpO2: "96%" },
      Lab: { WBC: "15,000", CRP: "12 mg/dL" },
      Meds: ["항생제 투여중 아님"],
      IO: { intake: "600ml", output: "200ml (8시간)" },
      Symptoms: "오한, 전신쇠약, 배뇨통",
      Treatment: "혈액배양 검사 오더 대기중"
    },
    requiredElements: [
      { key: "환자식별", sbarCategory: "S", keywords: ["605호", "최OO", "최○○", "요로감염", "UTI"], hint: "병실·환자명과 진단명(요로감염)을 함께 말하세요." },
      { key: "체온수치", sbarCategory: "S", keywords: ["39.2", "발열", "고열"], hint: "구체적 체온 수치가 빠지면 심각도가 전달되지 않습니다." },
      { key: "감염징후", sbarCategory: "B", keywords: ["WBC", "CRP", "오한"], hint: "감염 관련 검사 수치나 증상이 배경(B) 정보로 필요합니다." },
      { key: "활력징후변화", sbarCategory: "A", keywords: ["혈압", "BP", "100", "저혈압", "HR"], hint: "패혈증 의심 시 혈압 저하 여부가 중요한 평가 요소입니다." },
      { key: "요청사항", sbarCategory: "R", keywords: ["혈액배양", "항생제", "처방", "요청"], hint: "다음 조치를 명확히 요청해야 합니다." }
    ]
  },

  {
    id: "scn_05",
    title: "저혈당 노티",
    partnerName: "정하윤",
    partnerRole: "의사",
    trigger: "502호 정OO님(70세, 당뇨) 식은땀 및 의식저하, 혈당 45mg/dL 측정",
    patient: {
      room: "502호",
      name: "정OO",
      ageSex: "70세/M",
      diagnosis: "제2형 당뇨병",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "03:12" }
    ],
    chartData: {
      VS: { BP: "110/70", HR: "95", RR: "18", BT: "36.5", SpO2: "98%" },
      Lab: { 혈당: "45mg/dL (방금 측정)" },
      Meds: ["인슐린 투여중 (아침 10U 투여함)"],
      IO: { intake: "300ml", output: "250ml" },
      Symptoms: "식은땀, 손떨림, 의식 저하(졸림, 호명 반응 저하)",
      Treatment: "50% 포도당 투여 준비중"
    },
    requiredElements: [
      { key: "환자식별", sbarCategory: "S", keywords: ["502호", "정OO", "정○○", "당뇨", "당뇨병"], hint: "병실·환자명과 진단명(당뇨)을 함께 말하세요." },
      { key: "혈당수치", sbarCategory: "S", keywords: ["45", "혈당", "저혈당"], hint: "구체적 혈당 수치가 핵심 정보입니다." },
      { key: "의식상태", sbarCategory: "A", keywords: ["의식", "저하", "졸림", "호명"], hint: "의식 수준 변화는 저혈당 응급도 판단에 필수입니다." },
      { key: "증상", sbarCategory: "A", keywords: ["식은땀", "떨림"], hint: "동반 증상이 상태 평가에 포함되어야 합니다." },
      { key: "요청사항", sbarCategory: "R", keywords: ["포도당", "처방", "요청"], hint: "필요한 처치를 명확히 요청해야 합니다." }
    ]
  },

  {
    id: "scn_06",
    title: "수혈 반응 의심 노티",
    partnerName: "한지우",
    partnerRole: "의사",
    trigger: "1005호 한OO님 수혈 시작 15분 후 오한 및 두드러기 발생",
    patient: {
      room: "1005호",
      name: "한OO",
      ageSex: "62세/F",
      diagnosis: "위암 수술 후",
      pod: "POD#2"
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "03:12" }
    ],
    chartData: {
      VS: { BP: "105/70 (수혈 전 120/80)", HR: "105", RR: "22", BT: "38.0 (수혈 전 36.8)", SpO2: "96%" },
      Lab: { "수혈 전 Hb": "6.8 g/dL" },
      Meds: ["PRBC 1 pint 수혈중"],
      IO: { intake: "정상", output: "정상" },
      Symptoms: "오한, 두드러기, 가려움증, 요통 호소",
      Treatment: "수혈 즉시 중단, 생리식염수로 라인 유지중"
    },
    requiredElements: [
      { key: "환자식별", sbarCategory: "S", keywords: ["1005호", "한OO", "한○○", "위암", "POD"], hint: "병실·환자명·진단명·수술 후 경과일(POD#2)을 함께 말하세요." },
      { key: "수혈반응증상", sbarCategory: "S", keywords: ["오한", "두드러기", "발진", "가려움"], hint: "수혈 반응의 구체적 증상이 핵심 정보입니다." },
      { key: "활력징후변화", sbarCategory: "A", keywords: ["체온", "38.0", "혈압", "BP"], hint: "수혈 전후 활력징후 변화가 평가(A)에 필요합니다." },
      { key: "조치사항", sbarCategory: "B", keywords: ["수혈", "중단"], hint: "이미 취한 조치(수혈 중단)를 알려야 의사가 다음 판단을 할 수 있습니다." },
      { key: "요청사항", sbarCategory: "R", keywords: ["처방", "요청", "봐주세요"], hint: "다음 조치를 명확히 요청해야 합니다." }
    ]
  }
];

/**
 * id로 시나리오 조회
 * @param {string} id
 * @returns {object|undefined}
 */
function getScenarioById(id) {
  return scenarios.find((s) => s.id === id);
}

/**
 * 대화창/상단바에 표시할 의사 이름 (예: 김민수의사)
 */
function getPartnerLabel(scenario) {
  const name = (scenario && scenario.partnerName) || "당직";
  return name.endsWith("의사") ? name : `${name}의사`;
}

/**
 * 환자 한 줄 요약 (호실·이름·진단·POD)
 */
function formatPatientSummary(patient) {
  if (!patient) return "";
  const who = [patient.room, patient.name, patient.ageSex ? `(${patient.ageSex})` : null]
    .filter(Boolean)
    .join(" ");
  const extras = [
    patient.diagnosis ? `Dx. ${patient.diagnosis}` : null,
    patient.pod || null
  ].filter(Boolean);
  return [who, ...extras].filter(Boolean).join(" · ");
}

/**
 * 목록 카드용 짧은 부제 — trigger 앞부분(환자 위치+상황)
 */
function getScenarioCardSubtitle(scenario) {
  const trigger = (scenario && scenario.trigger) || "";
  if (!trigger) return scenario.subtitle || "";

  const commaIdx = trigger.indexOf(",");
  if (commaIdx > 8) return trigger.slice(0, commaIdx).trim();
  if (trigger.length > 36) return `${trigger.slice(0, 36).trim()}…`;
  return trigger;
}
