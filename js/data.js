/**
 * 시나리오 데이터
 * - 6-2: chartData / requiredCategories / doctorQuestions
 * - 자유 텍스트 채점: requiredElements { key, sbarCategory, keywords, hint }
 */
const scenarios = [
  {
    id: "scn_01",
    title: "낙상 발생 노티",
    subtitle: "야간 근무 중 침상 낙상 발견",
    partnerName: "당직의",
    partnerRole: "의사",
    trigger: "802호 김OO님 침상에서 낙상, 신규간호사인 당신이 발견",

    messages: [
      { sender: "partner", text: "네, 무슨 일이세요?", time: "03:12" }
    ],

    context: {
      patient: "802호 김OO (78세, F)",
      situation: "침상 낙상 발견, 후두부 통증 호소",
      vitals: { BP: "128/76", HR: "88", RR: "18", BT: "36.7", SpO2: "97%" }
    },

    chartData: {
      VS: { BP: "128/76", HR: "88", RR: "18", BT: "36.7", SpO2: "97%" },
      Lab: { "최근 CBC": "정상범위", "최근 PT/INR": "1.4 (항응고제 복용중)" },
      Meds: ["와파린 5mg qd", "아스피린 100mg qd"],
      IO: { intake: "1200ml", output: "900ml" },
      Symptoms: "낙상 후 후두부 통증 호소, 의식 명료, 구토 없음",
      Treatment: "낙상 직후 활력징후 측정 완료, 냉찜질 적용"
    },

    requiredCategories: ["VS", "Lab", "Meds", "Symptoms"],

    doctorQuestions: [
      {
        category: "Meds",
        question: "이 환자 항응고제 드시고 계신가요?",
        ifChecked: { answerText: "네, 와파린 복용 중입니다.", ok: true },
        ifNotChecked: { answerText: "확인 후 다시 전화드리겠습니다.", ok: false }
      },
      {
        category: "Symptoms",
        question: "의식 상태랑 두통 호소는 어때요?",
        ifChecked: { answerText: "의식 명료하고 후두부 통증 호소하고 있습니다.", ok: true },
        ifNotChecked: { answerText: "다시 확인해보겠습니다.", ok: false }
      }
    ],

    // 자유 텍스트 노티 채점용 필수 요소
    requiredElements: [
      {
        key: "환자식별",
        sbarCategory: "S",
        keywords: ["802", "김", "78"],
        hint: "병실·환자명·나이를 포함하세요. (예: 802호 김OO 78세)"
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
