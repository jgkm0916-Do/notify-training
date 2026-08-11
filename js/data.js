/**
 * 시나리오 데이터
 * 스키마: 노티훈련앱_구조설계.md §2 + §6-2
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

    // 이 시나리오에서 진짜 필요한 카테고리
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

    choices: [
      {
        id: "c1",
        text: "선생님, 802호 환자 낙상하셨어요.",
        sbarScore: { S: 0, B: 0, A: 0, R: 0 },
        feedback: "환자 식별 정보, 구체적 수치/증상, 배경, 요청사항이 모두 빠져 있습니다."
      },
      {
        id: "c2",
        text: "802호 김OO님(78/F) 침상 낙상, 의식 명료·후두부 통증, PT/INR 1.4·와파린 복용 중입니다. 머리 CT 및 처치 부탁드립니다.",
        sbarScore: { S: 1, B: 1, A: 1, R: 1 },
        feedback: "환자 식별(S), 상황 배경(B), 평가(A), 요청(R)이 명확합니다. 적절한 노티입니다."
      },
      {
        id: "c3",
        text: "802호 김OO님 낙상하셨고 BP 128/76, HR 88입니다. 어떻게 할까요?",
        sbarScore: { S: 1, B: 0, A: 0, R: 0 },
        feedback: "환자·V/S는 있으나 항응고제·증상 평가와 구체적 요청(R)이 부족합니다."
      },
      {
        id: "c4",
        text: "802호 환자분 낙상 후 머리 아프다고 하세요. 와파린 드시는 분이에요. CT 찍어주세요.",
        sbarScore: { S: 0, B: 1, A: 0, R: 1 },
        feedback: "투약·요청은 있으나 정확한 환자 식별과 의식/증상 평가가 불충분합니다."
      }
    ],

    correctChoiceId: "c2"
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
