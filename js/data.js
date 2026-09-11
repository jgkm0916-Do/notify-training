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
    level: 1,
    levelLabel: "초급",
    closingLineNoR: "알겠습니다. 확인했으니 필요한 처치는 제가 상황 보고 판단해서 진행할게요.",
    trigger: "802호 윤정희님 침상에서 낙상, 침상 난간에 후두부를 부딪힘. 신규간호사인 당신이 발견",
    eventTime: "03:08",

    patient: {
      room: "802호",
      name: "윤정희",
      ageSex: "78세/F",
      diagnosis: "심방세동",
      pod: null
    },

    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "03:12" }
    ],

    chartData: {
      VS: { BP: "128/76", HR: "88", RR: "18", BT: "36.7", SpO2: "97%" },
      Lab: "어제 16:20 시행 - CBC 정상범위, PT/INR 1.4 (항응고제 복용중)",
      Meds: ["와파린 5mg qd", "아스피린 100mg qd"],
      IO: { intake: "1200ml", output: "900ml" },
      Symptoms: "낙상 후 후두부 통증 호소, 촉진 시 압통(+) 경미한 부종 있음 열상 없음, 의식 명료, 구토 없음",
      Treatment: "낙상 직후 활력징후 측정 완료, 냉찜질 적용"
    },

    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["802"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["윤정희"],
        hint: "환자 성명을 말하세요.",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "환자 성명을 확인해야 다른 환자와 혼동하는 것을 예방할 수 있습니다."
      },
      {
        key: "현재상황",
        sbarCategory: "S",
        keywords: ["낙상", "넘어"],
        hint: "현재 상황(침상 낙상)을 명확히 전달하세요.",
        rationale: "낙상 사실을 먼저 전해야 의사가 두부 손상·출혈 위험을 바로 떠올릴 수 있습니다."
      },
      {
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["03:08", "3:08", "03시", "3시"],
        hint: "낙상이 발생한 시각(03:08)을 포함하세요.",
        rationale: "발생 시각이 있어야 경과 시간과 추가 검사·관찰 시점을 판단할 수 있습니다."
      },
      {
        key: "항응고배경",
        sbarCategory: "B",
        keywords: ["와파린", "항응고", "INR", "1.4", "아스피린"],
        hint: "항응고제 복용 또는 PT/INR 등 관련 배경을 포함하세요.",
        rationale: "항응고 복용·INR은 두부 외상 후 출혈 위험을 높여 CT·처치 우선순위에 영향을 줍니다."
      },
      {
        key: "의식상태",
        sbarCategory: "A",
        keywords: ["의식", "명료", "기면", "혼미", "반혼수", "혼수"],
        hint: "의식 수준 평가",
        followUpQuestion: "의식 상태는 어떠세요?",
        rationale: "의식 수준은 두개내 출혈·뇌손상 진행 여부를 가늠하는 핵심 지표입니다."
      },
      {
        key: "두부손상상태",
        sbarCategory: "A",
        keywords: ["후두부", "부종", "열상", "압통", "출혈", "혈종", "찰과상"],
        hint: "부딪힌 부위(두부) 상태",
        followUpQuestion: "부딪힌 부위 상태는 어떠세요? 부종이나 열상, 압통 있나요?",
        rationale: "부종·열상·압통 정보는 국소 손상 정도와 CT·봉합 필요성을 판단하는 근거입니다."
      },
      {
        key: "신경학적증상",
        sbarCategory: "A",
        keywords: ["구토", "오심", "어지러움", "두통"],
        hint: "구토·어지러움 등 동반 증상",
        followUpQuestion: "구토나 어지러움 같은 증상은 없으세요?",
        rationale: "구토·어지러움·두통은 두개내 병변을 시사할 수 있어 누락 시 위험 신호가 빠집니다."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywords: ["128", "76", "BP", "혈압", "88", "HR", "심박"],
        hint: "측정한 활력징후 수치(BP, HR 등)를 포함하세요.",
        rationale: "구체 수치는 쇼크·이차 손상 여부를 객관적으로 전달하는 필수 평가입니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["CT", "처방", "방문", "확인", "요청", "부탁", "지시"],
        hint: "의사에게 원하는 검사·처치·방문을 구체적으로 요청하세요.",
        rationale: "원하는 검사·방문·처치를 명시해야 의사가 바로 실행할 다음 단계를 잡을 수 있습니다."
      }
    ]
  },

  {
    id: "scn_02",
    title: "흉통 노티",
    partnerName: "박준호",
    partnerRole: "의사",
    level: 2,
    levelLabel: "중급",
    closingLineNoR: "알겠습니다. 지금 바로 가서 확인해볼게요.",
    trigger: "701호 송재호님(65세, M) 갑작스러운 흉통 호소, 좌측 방사통 동반",
    eventTime: "14:20",
    patient: {
      room: "701호",
      name: "송재호",
      ageSex: "65세/M",
      diagnosis: "불안정성 협심증 의증",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "14:24" }
    ],
    chartData: {
      VS: { BP: "150/95", HR: "102", RR: "22", BT: "36.8", SpO2: "95%" },
      Lab: "오늘 14:25 채혈 - Troponin 결과 대기중 · 과거력: 고혈압, 당뇨",
      Meds: ["아스피린 100mg qd", "메트포르민 500mg bid"],
      IO: { intake: "800ml", output: "700ml" },
      Symptoms: "흉통 NRS 7/10, 좌측 어깨 방사통, 식은땀, 호흡곤란 동반",
      Treatment: "흉통 프로토콜에 따라 ECG 모니터링 및 Troponin 채혈 시행, NTG 설하정 투여 전"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["701"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["송재호"],
        hint: "환자 성명을 말하세요.",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "환자 성명을 확인해야 다른 환자와 혼동하는 것을 예방할 수 있습니다."
      },
      {
        key: "흉통양상",
        sbarCategory: "S",
        keywords: ["흉통", "방사통", "NRS"],
        hint: "통증 양상과 강도가 빠지면 심각도 판단이 어렵습니다.",
        rationale: "방사통·강도는 심근허혈 가능성을 시사하며, 양상 없이 보고하면 심각도가 전달되지 않습니다."
      },
      {
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["14:20", "2시 20", "14시"],
        hint: "흉통이 시작된 시각(14:20)을 포함하세요.",
        rationale: "흉통 시작 시각은 증상 지속 시간과 응급 처치 시점을 판단하는 기준입니다."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywords: ["혈압", "BP", "150", "심박", "HR"],
        hint: "구체적 수치가 없으면 상태 평가가 전달되지 않습니다.",
        rationale: "혈압·심박 수치는 혈역학 불안정 여부를 보여 주어 처치 강도 결정에 필요합니다."
      },
      {
        key: "심전도확인",
        sbarCategory: "A",
        keywords: ["12리드", "12-lead", "촬영", "찍었", "전송", "보내드", "보여드", "사진", "정상동", "ST"],
        hint: "흉통 시 ECG 확인 여부는 필수 보고 항목입니다.",
        followUpQuestion: "12리드 ECG는 찍으셨어요? 사진 보내주시거나 보여주실 수 있어요?",
        rationale: "흉통 환자는 12리드 ECG로 ST 변화 유무를 확인해야 하며, 전달하지 않으면 골든타임 판단이 늦어질 수 있습니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["방문", "봐주세요", "와주세요", "확인 부탁", "처방", "지시"],
        hint: "방문·처방 확인 등 구체적 요청을 포함하세요.",
        followUpQuestion: "선생님, 방문하셔서 확인해 주시겠어요? 처방된 NTG 투여해도 될지도 확인 부탁드립니다.",
        rationale: "구체적인 요청(방문 또는 처방 확인)이 있어야 의사가 우선순위를 판단하고 신속히 대응할 수 있습니다. 다만 처방은 의사의 권한이므로, 간호사는 소견을 보고하고 지시를 요청하는 형태가 적절합니다."
      }
    ]
  },

  {
    id: "scn_03",
    title: "호흡곤란 노티",
    partnerName: "이서연",
    partnerRole: "의사",
    level: 3,
    levelLabel: "고급",
    closingLineNoR: "알겠습니다. 바로 가겠습니다.",
    trigger: "903호 배영숙님(80세, COPD) 갑자기 호흡곤란 호소, SpO2 88%로 저하",
    eventTime: "22:15",
    patient: {
      room: "903호",
      name: "배영숙",
      ageSex: "80세/F",
      diagnosis: "COPD",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "22:18" }
    ],
    chartData: {
      VS: { BP: "130/80", HR: "118", RR: "30", BT: "37.0", SpO2: "88% (비강캐뉼라 2L 적용중)" },
      Lab: "22:15 시점 ABGA 미시행 · 과거력: COPD 10년",
      Meds: ["기관지확장제 흡입기 qid"],
      IO: { intake: "1000ml", output: "950ml" },
      Symptoms: "호흡곤란, 좌위호흡, 청색증 의심",
      Treatment: "산소 2L → 4L 상향 적용, 기도흡인 시행"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["903"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["배영숙"],
        hint: "환자 성명을 말하세요.",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "환자 성명을 확인해야 다른 환자와 혼동하는 것을 예방할 수 있습니다."
      },
      {
        key: "현재상황",
        sbarCategory: "S",
        keywords: ["호흡곤란", "숨이", "숨차", "호흡 곤란"],
        hint: "갑작스러운 호흡곤란 상황",
        followUpQuestion: "지금 환자분이 어떤 상태인가요?",
        rationale: "현재 문제(호흡곤란)를 먼저 전해야 의사가 긴급도를 바로 파악할 수 있습니다."
      },
      {
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["22:15", "10시 15", "22시"],
        hint: "호흡곤란이 발생한 시각(22:15)을 포함하세요.",
        followUpQuestion: "언제부터 그랬어요?",
        rationale: "발생 시각이 있어야 증상 진행 속도와 응급 개입 시점을 판단할 수 있습니다."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywordGroups: [
          ["130/80", "130", "bp", "혈압"],
          ["118", "hr", "심박", "맥박"],
          ["호흡수", "rr", "30회"],
          ["37.0", "37도", "bt", "체온"],
          ["88", "spo2", "산소포화도"]
        ],
        hint: "BP·HR·RR·BT·SpO₂ 전체 활력징후",
        followUpQuestion: "지금 바이탈하고 산소포화도는 어떻게 돼요?",
        rationale: "호흡곤란 시 혈압·맥박·호흡수·체온·산소포화도를 함께 전달해야 전신 상태와 저산소 정도를 판단할 수 있습니다."
      },
      {
        key: "산소요법현황",
        sbarCategory: "B",
        keywordGroups: [
          [
            "np",
            "n-p",
            "n/p",
            "n.p",
            "nc",
            "nasal prong",
            "nasal cannula",
            "비강캐뉼라",
            "비강 캐뉼라",
            "비강카테터",
            "비강 카테터",
            "코줄"
          ],
          [
            "2l",
            "2 l",
            "2ℓ",
            "2리터",
            "2 리터",
            "2liter",
            "2 liters",
            "2l/min",
            "2 l/min",
            "분당 2리터"
          ]
        ],
        hint: "산소 장치와 유량(예: 비강캐뉼라 2L)",
        followUpQuestion: "지금 산소는 하고 있어요?",
        rationale: "현재 산소 장치와 유량을 함께 알아야 추가 산소·방문 필요성을 판단할 수 있습니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        required: false,
        keywords: [
          "봐주세요",
          "와주세요",
          "방문",
          "확인 부탁",
          "추가 처방",
          "ABGA",
          "네뷸",
          "네뷸라이저"
        ],
        hint: "필요한 조치를 함께 요청하면 더욱 적극적인 노티가 됩니다.",
        passHint: "필요한 조치까지 명확하게 요청했습니다.",
        rationale: "필수 상태 보고가 우선입니다. 요청은 있으면 더 적극적인 노티가 됩니다."
      }
    ]
  },

  {
    id: "scn_04",
    title: "발열 노티",
    partnerName: "최유진",
    partnerRole: "의사",
    level: 1,
    levelLabel: "초급",
    closingLineNoR: "알겠습니다. 확인했으니 필요한 처치는 제가 상황 보고 판단해서 진행할게요.",
    trigger: "605호 강미숙님(55세) 발열 및 오한 호소, 최근 요로감염 병력",
    eventTime: "06:40",
    patient: {
      room: "605호",
      name: "강미숙",
      ageSex: "55세/F",
      diagnosis: "요로감염",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "06:45" }
    ],
    chartData: {
      VS: { BP: "100/60", HR: "110", RR: "24", BT: "39.2", SpO2: "96%" },
      Lab: "어제 09:00 시행 - WBC 12,300 (상승), CRP 8.2 (상승)",
      Meds: ["항생제 투여중 아님"],
      IO: { intake: "600ml", output: "200ml (8시간)" },
      Symptoms: "오한, 전신쇠약, 배뇨통",
      Treatment: "혈액배양 검사 오더 대기중"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["605"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["강미숙"],
        hint: "환자 성명을 말하세요.",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "환자 성명을 확인해야 다른 환자와 혼동하는 것을 예방할 수 있습니다."
      },
      {
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["06:40", "6:40", "6시 40", "06시"],
        hint: "발열을 확인한 시각(06:40)을 포함하세요.",
        rationale: "확인 시각이 있어야 발열 경과와 재측정·처치 시점을 판단할 수 있습니다."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywordGroups: [
          ["BT", "체온", "39.2"],
          ["BP", "혈압", "HR", "맥박"]
        ],
        hint: "체온 포함 전체 활력징후",
        followUpQuestion: "체온이랑 혈압, 맥박은 어떠세요?",
        rationale: "고체온 시 빈맥 동반 여부가 패혈증 초기 징후일 수 있어, 체온만 보고하면 전신 상태 판단이 늦어질 수 있습니다."
      },
      {
        key: "감염징후",
        sbarCategory: "B",
        keywords: ["WBC", "CRP", "오한"],
        hint: "감염 관련 검사 수치나 증상이 배경(B) 정보로 필요합니다.",
        followUpQuestion: "최근 WBC, CRP 확인하신 적 있으세요? 언제 결과고 수치가 어땠어요?",
        rationale: "WBC·CRP·오한은 감염 진행 배경을 보여 주어 항생제·배양 판단을 돕습니다."
      },
      {
        key: "항생제투약여부",
        sbarCategory: "B",
        keywords: ["항생제", "미투여", "투약 중"],
        hint: "현재 항생제 투약 여부",
        followUpQuestion: "현재 항생제 투약 중이신가요?",
        rationale: "항생제 투여 여부에 따라 원인균 커버 범위나 배양검사 타이밍 판단이 달라집니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["혈액배양", "항생제", "처방", "요청"],
        hint: "다음 조치를 명확히 요청해야 합니다.",
        rationale: "혈액배양·항생제 등 구체 요청이 있어야 다음 처치가 바로 이어질 수 있습니다."
      }
    ]
  },

  {
    id: "scn_05",
    title: "저혈당 노티",
    partnerName: "정하윤",
    partnerRole: "의사",
    level: 2,
    levelLabel: "중급",
    closingLineNoR: "지금 바로 가겠습니다. 그 사이 프로토콜대로 처치 부탁드려요.",
    trigger: "502호 오정자님(70세, 당뇨) 식은땀 및 의식저하, 혈당 45mg/dL 측정",
    eventTime: "08:00",
    patient: {
      room: "502호",
      name: "오정자",
      ageSex: "70세/M",
      diagnosis: "제2형 당뇨병",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "08:03" }
    ],
    chartData: {
      VS: { BP: "110/70", HR: "95", RR: "18", BT: "36.5", SpO2: "98%" },
      Lab: "08:00 측정 - 혈당 45mg/dL",
      Meds: ["아침 07:00 Apidra(애피드라) 10U 투약함"],
      IO: { intake: "300ml", output: "250ml", 아침식사: "1/2만 섭취" },
      Symptoms: "식은땀, 손떨림, 의식 저하(졸림, 호명 반응 저하), 아침식사 1/2만 섭취",
      Treatment: "50% 포도당 투여 준비중"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["502"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["오정자"],
        hint: "환자 성명을 말하세요.",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "환자 성명을 확인해야 다른 환자와 혼동하는 것을 예방할 수 있습니다."
      },
      {
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["08:00", "8:00", "8시", "08시"],
        hint: "저혈당을 확인한 시각(08:00)을 포함하세요.",
        rationale: "확인 시각이 있어야 저혈당 경과와 재측정·처치 시점을 판단할 수 있습니다."
      },
      {
        key: "혈당수치",
        sbarCategory: "S",
        keywords: ["45", "mg/dL", "mg/dl"],
        hint: "구체적 혈당 수치가 핵심 정보입니다.",
        followUpQuestion: "혈당 수치가 정확히 몇이었어요?",
        rationale: "'저혈당'이라는 표현만으로는 심각도를 판단할 수 없습니다. 정확한 수치가 있어야 의사가 응급도를 판단할 수 있습니다."
      },
      {
        key: "인슐린투약여부",
        sbarCategory: "B",
        keywords: ["인슐린", "Apidra", "애피드라", "10U", "투약"],
        hint: "인슐린 투약 시각 및 용량",
        followUpQuestion: "오늘 인슐린 투약하셨나요? 언제, 몇 유닛 맞으셨어요?",
        rationale: "저혈당의 원인을 파악하려면 인슐린 투약 시각과 용량이 식사 섭취량과 함께 확인되어야 합니다."
      },
      {
        key: "식이섭취상태",
        sbarCategory: "B",
        keywords: ["섭취", "식사", "절반", "1/2", "다 못", "안 먹"],
        hint: "최근 식사 섭취량",
        followUpQuestion: "아침 식사는 얼마나 드셨어요?",
        rationale: "인슐린 투약 후 식사 섭취가 부족하면 저혈당 위험이 커집니다. 섭취량 확인이 원인 파악에 중요합니다."
      },
      {
        key: "의식상태",
        sbarCategory: "A",
        keywords: ["의식", "저하", "졸림", "호명"],
        hint: "의식 수준 변화는 저혈당 응급도 판단에 필수입니다.",
        rationale: "의식 저하는 저혈당 중증도와 기도·안전 관리 필요성을 판단하는 핵심입니다."
      },
      {
        key: "증상",
        sbarCategory: "A",
        keywords: ["식은땀", "떨림"],
        hint: "동반 증상이 상태 평가에 포함되어야 합니다.",
        rationale: "식은땀·떨림은 저혈당 동반 증상을 뒷받침해 상태 평가의 신뢰도를 높입니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["방문", "봐주세요", "와주세요", "확인 부탁", "처방", "지시"],
        hint: "방문·긴급도 전달 등 구체적 요청을 포함하세요.",
        followUpQuestion: "선생님, 의식 저하가 있어서 바로 봐주실 수 있을까요?",
        rationale: "의식 변화를 동반한 저혈당은 응급 상황입니다. 구체적인 처치를 지정하기보다, 즉시 방문이 필요하다는 긴급도를 명확히 전달하는 것이 우선입니다."
      }
    ]
  },

  {
    id: "scn_06",
    title: "수혈 반응 의심 노티",
    partnerName: "한지우",
    partnerRole: "의사",
    level: 3,
    levelLabel: "고급",
    closingLineNoR: "알겠습니다. 바로 가겠습니다.",
    trigger: "1005호 임현수님 수혈 시작 15분 후 오한 및 두드러기 발생",
    eventTime: "16:45",
    patient: {
      room: "1005호",
      name: "임현수",
      ageSex: "62세/F",
      diagnosis: "위암 수술 후",
      pod: "POD#2"
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "16:47" }
    ],
    chartData: {
      VS: "수혈 전 BP 120/80, HR 78, RR 16, BT 36.8, SpO2 98% · 현재 BP 105/70, HR 105, RR 22, BT 38.0, SpO2 96%",
      Lab: "오늘 15:30 수혈 전 시행 - Hb 6.8 g/dL",
      Meds: "PRBC 1pint, 수혈 시작 16:30, 증상 발생(16:45)까지 대략 1/3 정도 주입된 상태",
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
        keywords: ["임현수"],
        hint: "환자 성명을 말하세요.",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "환자 성명을 확인해야 다른 환자와 혼동하는 것을 예방할 수 있습니다."
      },
      {
        key: "수혈중단",
        allowAffirmativeConfirmation: true,
        sbarCategory: "B",
        keywords: ["중단", "중지", "멈춤", "스탑", "라인 잠금", "클램프"],
        hint: "수혈 즉시 중단 여부",
        followUpQuestion: "수혈은 바로 중단했어요?",
        rationale: "수혈 부작용 의심 시 원인 확인보다 즉시 중단이 우선입니다. 중단 없이 보고하면 의사가 반응이 계속되는 줄 모른 채 판단하게 됩니다."
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
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["16:45", "4시 45", "16시 45", "15분", "십오분"],
        hint: "증상 발생 시각(16:45) 또는 수혈 시작 후 경과 시간(15분)",
        followUpQuestion: "증상은 언제부터였어요?",
        rationale: "발생 시각·수혈 후 경과시간은 급성 수혈 반응 가능성과 보고 시점을 판단하는 기준입니다."
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
        key: "수혈진행정보",
        sbarCategory: "B",
        keywordGroups: [
          ["16:30", "4시 30", "16시 30", "4:30"],
          ["50ml", "50 ml", "50mL", "50cc", "50씨씨", "1/3", "삼분의일", "절반", "1/2", "이분의일", "조금", "약간"]
        ],
        hint: "수혈 시작 시각(16:30)과 증상 발생 시점까지 주입량(50mL)",
        followUpQuestion: "수혈은 몇 시에 시작했고 지금까지 얼마나 들어갔어요?",
        rationale:
          "시작 시각과 주입량이 있어야 반응 시점·노출량을 파악하고 이후 처치 계획을 세울 수 있습니다."
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
  },

  {
    id: "scn_07",
    title: "배변 이상 노티",
    partnerName: "박지훈",
    partnerRole: "의사",
    level: 1,
    levelLabel: "초급",
    closingLineNoR: "알겠습니다. 확인했으니 필요한 처치는 제가 상황 보고 판단해서 진행할게요.",
    trigger: "604호 홍길순님, 수술 후 3일째 배변 없음. 복부 불편감 호소",
    eventTime: "10:30",
    patient: {
      room: "604호",
      name: "홍길순",
      ageSex: "68세/F",
      diagnosis: "대장암 수술 후",
      pod: "POD#3"
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "10:32" }
    ],
    chartData: {
      VS: "BP 122/78, HR 76, RR 16, BT 36.6, SpO2 98%",
      Lab: "특이 소견 없음",
      Meds: "옥시코돈 5mg PRN (마지막 투여 08:00), 변비약 미투여",
      IO: "intake 1500ml · output 1400ml, 최근 배변 3일 전",
      Symptoms: "복부 팽만감 호소, 장음 감소, 오심 없음, 방귀는 있음",
      Treatment: "복부 촉진 시행, 아직 완화제 투여 전"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["604"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["홍길순"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "마지막배변일",
        sbarCategory: "S",
        keywords: ["3일", "사흘", "배변"],
        hint: "마지막 배변 시점",
        followUpQuestion: "마지막 배변이 언제였어요?",
        rationale: "무배변 기간이 처치 방향(관장·완화제 등)을 결정하는 핵심 정보입니다."
      },
      {
        key: "마약성진통제사용",
        sbarCategory: "B",
        keywords: ["옥시코돈", "마약성", "진통제", "PRN"],
        hint: "마약성 진통제 사용 여부",
        followUpQuestion: "마약성 진통제 쓰고 계신가요?",
        rationale: "마약성 진통제는 장운동을 저하시켜 변비의 흔한 원인이 되므로, 원인 파악에 필수적입니다."
      },
      {
        key: "복부사정",
        sbarCategory: "A",
        keywords: ["팽만", "장음", "복부", "촉진"],
        hint: "복부 팽만·장음 상태",
        followUpQuestion: "복부 상태는 어떠세요? 팽만감이나 장음은 확인하셨어요?",
        rationale: "복부 팽만·장음 감소는 장폐색 등 더 심각한 문제와 감별해야 할 소견입니다."
      },
      {
        key: "동반증상",
        sbarCategory: "A",
        keywords: ["오심", "구토", "방귀", "가스"],
        hint: "오심·구토 동반 여부, 가스 배출 여부",
        followUpQuestion: "오심이나 구토는 없으세요? 가스는 나오세요?",
        rationale: "가스 배출 여부는 완전 폐색인지 단순 변비인지 감별하는 데 중요합니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["처방", "완화제", "관장", "지시", "확인 부탁"],
        hint: "완화제·관장 등 처치 지시 요청",
        followUpQuestion: "완화제 처방이나 관장 필요할지 확인 부탁드려도 될까요?",
        rationale: "구체적 처치 방향에 대한 확인 요청이 있어야 의사가 신속히 지시할 수 있습니다."
      }
    ]
  },

  {
    id: "scn_08",
    title: "약물 알레르기 반응 노티",
    partnerName: "김도현",
    partnerRole: "의사",
    level: 1,
    levelLabel: "초급",
    closingLineNoR: "알겠습니다. 확인했으니 필요한 처치는 제가 상황 보고 판단해서 진행할게요.",
    trigger: "308호 이수진님, 항생제 투여 후 전신 두드러기 발생. 활력징후 안정적",
    eventTime: "13:40",
    patient: {
      room: "308호",
      name: "이수진",
      ageSex: "45세/F",
      diagnosis: "폐렴으로 항생제 치료 중",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "13:42" }
    ],
    chartData: {
      VS: "BP 118/76, HR 82, RR 18, BT 36.9, SpO2 99%",
      Lab: "특이 소견 없음",
      Meds: "세프트리악손 2g + NS 100ml IV 13:30부터 30분 예정으로 투여 시작, 10분 후 증상 발생",
      IO: "intake 정상 · output 정상",
      Symptoms: "전신 두드러기, 가려움증 호소, 호흡곤란·부종 없음",
      Treatment: "투여 즉시 중단, 활력징후 측정 완료"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["308"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["이수진"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "원인약물중단여부",
        sbarCategory: "B",
        keywords: ["중단", "중지", "멈춤"],
        hint: "원인 의심 약물 투여 중단 여부",
        followUpQuestion: "투여는 중단하셨어요? 얼마나 들어간 상태예요?",
        rationale: "알레르기 반응 의심 시 원인 확인보다 투여 중단이 우선입니다. 아직 dropping 중인 상태에서 중단 없이 보고하면 반응이 계속되는 줄 모른 채 판단하게 됩니다."
      },
      {
        key: "원인약물확인",
        sbarCategory: "B",
        keywords: ["세프트리악손", "항생제", "약물명"],
        hint: "원인 의심 약물명",
        followUpQuestion: "무슨 약물 투여 중이었어요?",
        rationale: "원인 약물을 특정해야 향후 처방에서 교차반응 약물을 피할 수 있습니다."
      },
      {
        key: "증상양상",
        sbarCategory: "A",
        keywords: ["두드러기", "가려움", "발진"],
        hint: "피부 반응 양상",
        followUpQuestion: "어떤 증상이 있나요?",
        rationale: "피부 반응의 범위와 양상은 중증도 판단의 기초 정보입니다."
      },
      {
        key: "전신증상동반여부",
        sbarCategory: "A",
        keywords: ["호흡곤란", "부종", "어지러움", "없", "안정"],
        hint: "호흡곤란·부종 등 전신 반응 동반 여부",
        followUpQuestion: "호흡곤란이나 얼굴·입술 부종은 없으세요?",
        rationale: "호흡기·순환기 증상 동반 여부가 아나필락시스 여부를 가르는 핵심 감별점입니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["방문", "봐주세요", "확인 부탁", "처방", "지시"],
        hint: "의사 방문 또는 처방 지시 요청",
        followUpQuestion: "선생님, 방문하셔서 확인해 주시겠어요?",
        rationale: "구체적 요청이 있어야 의사가 우선순위를 판단해 신속히 대응할 수 있습니다."
      }
    ]
  },

  {
    id: "scn_09",
    title: "수술 후 오심·구토 노티",
    partnerName: "정유라",
    partnerRole: "의사",
    level: 1,
    levelLabel: "초급",
    closingLineNoR: "알겠습니다. 확인했으니 필요한 처치는 제가 상황 보고 판단해서 진행할게요.",
    trigger: "410호 강민호님, 수술 후 오심 호소하며 1회 구토",
    eventTime: "09:20",
    patient: {
      room: "410호",
      name: "강민호",
      ageSex: "52세/M",
      diagnosis: "담낭절제술 후",
      pod: "POD#1"
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "09:22" }
    ],
    chartData: {
      VS: "BP 128/82, HR 88, RR 18, BT 36.7, SpO2 98%",
      Lab: "특이 소견 없음",
      Meds: "펜타닐 PCA 사용 중, 마지막 진통제 투여 08:30",
      IO: "intake 800ml · output 600ml, 금일 아침 식이 섭취 안 함",
      Symptoms: "오심 지속, 09:10경 1회 구토(음식물), 복부 팽만 없음",
      Treatment: "구토 후 좌위 유지, 아직 항구토제 투여 전"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["410"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["강민호"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "구토양상",
        sbarCategory: "S",
        keywords: ["구토", "횟수", "1회"],
        hint: "구토 횟수 및 양상",
        followUpQuestion: "구토는 몇 번 하셨고 어떤 양상이었어요?",
        rationale: "구토 횟수와 내용물은 원인 감별(마취 후유증, 장폐색 등)에 필요한 기초 정보입니다."
      },
      {
        key: "진통제사용여부",
        sbarCategory: "B",
        keywords: ["펜타닐", "PCA", "마약성", "진통제"],
        hint: "마약성 진통제 사용 여부",
        followUpQuestion: "마약성 진통제 쓰고 계신가요?",
        rationale: "마약성 진통제는 오심·구토의 흔한 원인이므로 원인 파악에 필요합니다."
      },
      {
        key: "복부증상",
        sbarCategory: "A",
        keywords: ["복부", "팽만", "통증"],
        hint: "복부 팽만·통증 동반 여부",
        followUpQuestion: "복부 팽만감이나 통증은 없으세요?",
        rationale: "복부 소견 동반 여부가 단순 약물 부작용인지 다른 합병증인지 감별에 필요합니다."
      },
      {
        key: "식이섭취상태",
        sbarCategory: "B",
        keywords: ["식이", "섭취", "금식", "안 먹"],
        hint: "최근 식이 섭취 상태",
        followUpQuestion: "오늘 식사는 좀 하셨어요?",
        rationale: "식이 섭취 여부는 항구토제 투여 방식(경구·주사) 결정에 참고가 됩니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["처방", "항구토제", "확인 부탁", "지시"],
        hint: "항구토제 등 처치 지시 요청",
        followUpQuestion: "항구토제 처방 확인 부탁드려도 될까요?",
        rationale: "구체적 처치 방향 확인 요청이 있어야 의사가 신속히 지시할 수 있습니다."
      }
    ]
  },

  {
    id: "scn_10",
    title: "급성 설사 노티",
    partnerName: "윤서준",
    partnerRole: "의사",
    level: 2,
    levelLabel: "중급",
    closingLineNoR: "알겠습니다. 확인했으니 필요한 처치는 제가 상황 보고 판단해서 진행할게요.",
    trigger: "506호 오순자님, 오늘 아침부터 수양성 설사 5회, 어지러움 호소",
    eventTime: "07:00",
    patient: {
      room: "506호",
      name: "오순자",
      ageSex: "74세/F",
      diagnosis: "고혈압으로 이뇨제 복용 중",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "07:02" }
    ],
    chartData: {
      VS: "BP 100/62, HR 102, RR 18, BT 37.0, SpO2 97%",
      Lab: "어제 18:00 시행 - K+ 3.1 (저하), Na+ 133",
      Meds: "푸로세미드(라식스) 20mg qd 복용 중",
      IO: "intake 700ml · output(설사 포함) 1800ml, 오늘 설사 5회",
      Symptoms: "수양성 설사 5회, 전신 위약감, 어지러움 호소, 경미한 복통",
      Treatment: "활력징후 측정 완료, 수액 투여 전"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["506"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["오순자"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "설사양상",
        sbarCategory: "S",
        keywords: ["설사", "수양성", "5회", "횟수"],
        hint: "설사 횟수와 양상",
        followUpQuestion: "설사는 몇 번 하셨고 어떤 양상이었어요?",
        rationale: "횟수와 성상은 탈수·전해질 손실 정도를 가늠하는 기초 정보입니다."
      },
      {
        key: "이뇨제사용여부",
        sbarCategory: "B",
        keywords: ["이뇨제", "라식스", "푸로세미드"],
        hint: "이뇨제 복용 여부",
        followUpQuestion: "혹시 이뇨제 복용 중이신가요?",
        rationale: "이뇨제와 설사가 겹치면 전해질 소실이 더 심해질 수 있어, 원인 파악에 중요한 배경 정보입니다."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywordGroups: [
          ["BP", "혈압", "100"],
          ["HR", "맥박", "102"]
        ],
        hint: "혈압, 맥박",
        followUpQuestion: "혈압이랑 맥박은 어떠세요?",
        rationale: "빈맥을 동반한 저혈압 경향은 탈수로 인한 순환 혈액량 감소를 시사합니다."
      },
      {
        key: "전신증상",
        sbarCategory: "A",
        keywords: ["위약감", "어지러움", "힘없", "기운"],
        hint: "위약감·어지러움 동반 여부",
        followUpQuestion: "어지럽거나 힘이 빠지는 느낌은 없으세요?",
        rationale: "저칼륨혈증 시 나타나는 전형적 증상으로, 전해질 이상을 의심할 단서가 됩니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["수액", "전해질", "확인 부탁", "처방", "지시"],
        hint: "수액·전해질 검사 등 처치 지시 요청",
        followUpQuestion: "수액이나 전해질 검사 필요할지 확인 부탁드려도 될까요?",
        rationale: "구체적 처치 방향 확인 요청이 있어야 의사가 신속히 지시할 수 있습니다."
      }
    ]
  },

  {
    id: "scn_11",
    title: "낙상 후 신경학적 변화 노티",
    partnerName: "한소희",
    partnerRole: "의사",
    level: 2,
    levelLabel: "중급",
    closingLineNoR: "지금 바로 가겠습니다.",
    trigger: "809호 서말순님, 어제 낙상 후 관찰 중이었으나 오늘 오후 의식 변화 및 편측 위약 발생",
    eventTime: "14:00",
    patient: {
      room: "809호",
      name: "서말순",
      ageSex: "82세/F",
      diagnosis: "심방세동으로 항응고제 복용 중, 어제 낙상 관찰 중",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "14:02" }
    ],
    chartData: {
      VS: "BP 152/88, HR 58, RR 14, BT 36.5, SpO2 97%",
      Lab: "어제 낙상 직후 CT: 특이 소견 없음, INR 2.3 (항응고제 복용중)",
      Meds: "와파린 5mg qd 복용 중",
      IO: "intake 정상 · output 정상",
      Symptoms: "어제 09:00 낙상 후 의식 명료했으나, 오늘 14:00부터 좌측 상하지 위약감, 말 어눌해짐, 졸림 증가",
      Treatment: "활력징후 측정 완료, 신경학적 사정 시행 중"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["809"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["서말순"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "낙상과거력",
        sbarCategory: "S",
        keywords: ["어제", "낙상", "전날"],
        hint: "낙상 이력과 시점",
        followUpQuestion: "낙상은 언제 있었어요?",
        rationale: "낙상과 현재 증상 사이의 시간 간격이 지연성 출혈 가능성을 판단하는 핵심 단서입니다."
      },
      {
        key: "항응고제복용여부",
        sbarCategory: "B",
        keywords: ["와파린", "항응고", "INR"],
        hint: "항응고제 복용 및 INR 수치",
        followUpQuestion: "항응고제 복용 여부와 INR 수치는요?",
        rationale: "항응고제 복용 환자는 초기 CT가 정상이어도 시간이 지나며 지연성 출혈이 발생할 수 있어 반드시 확인해야 합니다."
      },
      {
        key: "신경학적변화양상",
        sbarCategory: "A",
        keywords: ["위약", "마비", "어눌", "구음", "편측"],
        hint: "편측 위약·구음장애 등 증상",
        followUpQuestion: "어느 쪽에 위약감이 있고, 말투는 어떤가요?",
        rationale: "편측 위약과 구음장애는 국소 신경학적 이상을 시사하는 응급 신호입니다."
      },
      {
        key: "의식수준변화",
        sbarCategory: "A",
        keywords: ["졸림", "의식", "저하", "명료했으나"],
        hint: "의식 수준 변화 여부",
        followUpQuestion: "의식 상태는 어떻게 변했어요?",
        rationale: "명료했던 의식이 저하되는 추세는 두개내압 상승을 의심할 수 있는 중요한 변화입니다."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywordGroups: [
          ["BP", "혈압", "152"],
          ["HR", "맥박", "서맥", "58"]
        ],
        hint: "혈압, 맥박(서맥 여부 포함)",
        followUpQuestion: "혈압이랑 맥박은 어떠세요?",
        rationale: "고혈압과 서맥이 함께 나타나는 것은 두개내압 상승을 시사하는 대표적 신호(쿠싱 반응)입니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["CT", "방문", "확인 부탁", "지시", "처방"],
        hint: "CT 재촬영 또는 방문 요청",
        followUpQuestion: "CT 재촬영이나 방문 필요할지 확인 부탁드려도 될까요?",
        rationale: "지연성 뇌출혈이 의심되는 상황이므로, 신속한 재영상검사 여부를 확인받는 것이 중요합니다."
      }
    ]
  },

  {
    id: "scn_12",
    title: "수술 후 출혈 의심 노티",
    partnerName: "임재현",
    partnerRole: "의사",
    level: 2,
    levelLabel: "중급",
    closingLineNoR: "지금 바로 가겠습니다.",
    trigger: "712호 김태호님, 수술 후 배액량 급증 및 활력징후 변화 관찰됨",
    eventTime: "05:00",
    patient: {
      room: "712호",
      name: "김태호",
      ageSex: "58세/M",
      diagnosis: "위절제술 후",
      pod: "POD#1"
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "05:02" }
    ],
    chartData: {
      VS: "이전(00:00) BP 118/76, HR 84, RR 16, BT 36.8, SpO2 98% · 현재(05:00) BP 96/60, HR 118, RR 20, BT 36.9, SpO2 96%",
      Lab: "수술 직후 Hb 11.2 g/dL → 오늘 05:00 재검 Hb 8.5 g/dL",
      Meds: "수액 유지 중, 진통제 PCA 사용 중",
      IO: "JP 배액관 - 지난 4시간 배액량 320ml(선홍색), 이전 시간당 평균 20~30ml에서 급증",
      Symptoms: "복부 팽만감 호소, 어지러움, 안색 창백",
      Treatment: "활력징후 재측정 완료, 수액 속도 유지 중"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["712"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["김태호"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "배액량변화",
        sbarCategory: "S",
        keywords: ["배액", "320", "증가", "선홍색"],
        hint: "배액량 변화 및 색깔",
        followUpQuestion: "배액량이 얼마나 늘었고 색깔은 어때요?",
        rationale: "배액량 급증과 선홍색 양상은 활동성 출혈을 의심하게 하는 직접적 신호입니다."
      },
      {
        key: "활력징후변화",
        sbarCategory: "A",
        keywordGroups: [
          ["BP", "혈압", "96"],
          ["HR", "맥박", "118"]
        ],
        hint: "이전 대비 혈압·맥박 변화",
        followUpQuestion: "이전이랑 비교해서 혈압, 맥박 어떻게 변했어요?",
        rationale: "혈압 하강과 빈맥이 함께 나타나는 추세는 출혈로 인한 순환 혈액량 감소를 시사합니다."
      },
      {
        key: "Hb수치변화",
        sbarCategory: "B",
        keywords: ["Hb", "혈색소", "8.5"],
        hint: "Hb 수치 변화",
        followUpQuestion: "Hb 수치는 어떻게 변했어요?",
        rationale: "짧은 시간 내 Hb가 크게 떨어지면 활동성 출혈을 의심해야 하며, 응급 수술적 지혈이 필요할 수 있습니다."
      },
      {
        key: "동반증상",
        sbarCategory: "A",
        keywords: ["창백", "어지러움", "복부팽만"],
        hint: "안색 창백·어지러움 등 동반 증상",
        followUpQuestion: "안색이나 어지러움은 어떠세요?",
        rationale: "안색 창백과 어지러움은 출혈로 인한 저혈량 상태를 뒷받침하는 신체 징후입니다."
      },
      {
        key: "관찰기간",
        sbarCategory: "S",
        keywords: ["4시간", "지난", "최근"],
        hint: "변화가 관찰된 시간 범위",
        followUpQuestion: "이 변화가 언제부터 언제까지 관찰된 거예요?",
        rationale: "짧은 시간 내 급격한 변화라는 점이 응급도를 판단하는 데 중요합니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["수혈", "방문", "확인 부탁", "지시", "처방"],
        hint: "수혈 또는 방문 요청",
        followUpQuestion: "수혈이나 방문 필요할지 확인 부탁드려도 될까요?",
        rationale: "활동성 출혈 의심 시 신속한 수혈 여부와 재수술 가능성을 의사가 즉시 판단해야 합니다."
      }
    ]
  },

  {
    id: "scn_13",
    title: "급성 뇌졸중 의심 노티",
    partnerName: "장민준",
    partnerRole: "의사",
    level: 3,
    levelLabel: "고급",
    closingLineNoR: "지금 바로 가겠습니다. 응급 코드 발동할게요.",
    trigger: "1102호 배창수님, 갑자기 우측 편마비 및 발음 이상 발생. 목격자 있음",
    eventTime: "11:05",
    patient: {
      room: "1102호",
      name: "배창수",
      ageSex: "70세/M",
      diagnosis: "고혈압, 심방세동 과거력",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "11:07" }
    ],
    chartData: {
      VS: "BP 178/98, HR 96(불규칙), RR 18, BT 36.7, SpO2 96%",
      Lab: "혈당 128 (즉시 확인), 아직 CT 시행 전",
      Meds: "암로디핀 복용 중, 항응고제 미복용",
      IO: "intake 정상 · output 정상",
      Symptoms: "11:05 우측 얼굴 처짐, 우측 팔다리 위약감(도수근력 2/5), 발음이 어눌하고 이해력은 유지됨",
      Treatment: "즉시 침상안정, 금식 지시, 신경학적 사정 및 혈당 체크 완료"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["1102"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["배창수"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "증상발생정확시각",
        sbarCategory: "S",
        keywords: ["11:05", "11시 5", "정확한 시각", "목격"],
        hint: "증상 발생 정확한 시각(목격 시점)",
        followUpQuestion: "증상이 정확히 몇 시부터 시작됐어요? 목격자가 있나요?",
        rationale: "뇌졸중은 발병 후 골든타임 내 혈전용해제 투여가 예후를 좌우하므로, 정확한 발생 시각 확인이 가장 중요합니다."
      },
      {
        key: "FAST증상",
        sbarCategory: "A",
        keywords: ["편마비", "얼굴 처짐", "위약", "어눌", "구음"],
        hint: "얼굴 처짐, 편측 위약, 언어 이상(FAST)",
        followUpQuestion: "얼굴 처짐, 팔다리 위약감, 언어 이상 각각 어떤가요?",
        rationale: "FAST(안면·팔·언어·시간) 사정은 뇌졸중 초기 선별의 표준 항목으로, 세 가지를 모두 확인해야 합니다."
      },
      {
        key: "혈당확인",
        sbarCategory: "A",
        keywords: ["혈당", "128"],
        hint: "저혈당 여부 확인(뇌졸중 유사 증상 감별)",
        followUpQuestion: "혈당은 확인하셨어요?",
        rationale: "저혈당도 편마비 등 뇌졸중과 유사한 증상을 유발할 수 있어, 감별을 위해 반드시 먼저 확인해야 합니다."
      },
      {
        key: "항응고제복용여부",
        sbarCategory: "B",
        keywords: ["항응고제", "미복용", "복용"],
        hint: "항응고제 복용 여부",
        followUpQuestion: "항응고제 복용 중이신가요?",
        rationale: "항응고제 복용 여부가 혈전용해제 사용 가능 여부 판단에 직접 영향을 줍니다."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywordGroups: [
          ["BP", "혈압", "178"],
          ["HR", "맥박", "불규칙"]
        ],
        hint: "혈압, 맥박(불규칙 리듬 포함)",
        followUpQuestion: "혈압이랑 맥박은 어떠세요?",
        rationale: "심방세동에 의한 불규칙한 맥박은 색전성 뇌졸중의 원인이 될 수 있어 중요한 정보입니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["CT", "방문", "즉시", "확인 부탁", "지시"],
        hint: "즉시 CT 및 방문 요청",
        followUpQuestion: "지금 즉시 CT 및 방문 필요할지 확인 부탁드려도 될까요?",
        rationale: "뇌졸중 의심 시 골든타임 내 신속한 영상검사와 의사 판단이 예후를 결정하므로 즉각적인 요청이 필수입니다."
      }
    ]
  },

  {
    id: "scn_14",
    title: "중증 저혈당 쇼크 노티",
    partnerName: "노하은",
    partnerRole: "의사",
    level: 3,
    levelLabel: "고급",
    closingLineNoR: "지금 바로 가겠습니다. 응급 코드 발동할게요.",
    trigger: "915호 방영식님, 반응 없이 침대에서 발견. 혈당 28mg/dL 측정됨",
    eventTime: "03:40",
    patient: {
      room: "915호",
      name: "방영식",
      ageSex: "68세/M",
      diagnosis: "제1형 당뇨병",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "03:42" }
    ],
    chartData: {
      VS: "BP 108/70, HR 122, RR 20, BT 36.2, SpO2 96%",
      Lab: "03:40 측정 · 혈당 28mg/dL",
      Meds: "저녁 21:00 인슐린 글라진(란투스) 20U 투여함, 저녁식사는 거의 섭취 못함",
      IO: "intake 200ml · output 150ml, 저녁식사 거의 섭취 안 함",
      Symptoms: "자극에 반응 없음(통증 자극에 약한 반응), 전신 식은땀, 경구 섭취 불가능한 상태",
      Treatment: "즉시 정맥로 확보, 경구 포도당 투여 불가로 판단"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["915"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["방영식"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "혈당수치",
        sbarCategory: "S",
        keywords: ["28"],
        hint: "구체적 혈당 수치",
        followUpQuestion: "혈당 수치가 정확히 몇이었어요?",
        rationale: "수치가 매우 낮을수록 응급도가 다르므로, 정확한 수치 보고가 응급 처치 결정에 필수입니다."
      },
      {
        key: "의식상태",
        sbarCategory: "A",
        keywords: ["반응 없", "자극", "무반응", "의식소실"],
        hint: "의식 수준(자극 반응 여부)",
        followUpQuestion: "지금 의식 상태가 어떠세요? 자극에 반응하나요?",
        rationale: "의식소실 동반 저혈당은 경구 섭취가 불가능한 응급 상황으로, 즉시 정맥 포도당 투여가 필요합니다."
      },
      {
        key: "경구섭취가능여부",
        sbarCategory: "A",
        keywords: ["경구", "섭취 불가", "삼킴", "먹일 수"],
        hint: "경구 섭취 가능 여부",
        followUpQuestion: "경구로 뭔가 드실 수 있는 상태인가요?",
        rationale: "의식저하로 경구 섭취가 불가능하면 반드시 정맥 내 포도당 투여로 전환해야 합니다."
      },
      {
        key: "인슐린투약여부",
        sbarCategory: "B",
        keywords: ["인슐린", "란투스", "글라진", "20U", "투약"],
        hint: "인슐린 투약 시각 및 용량",
        followUpQuestion: "언제 인슐린 맞으셨고 용량은요?",
        rationale: "인슐린 투약 시각과 용량, 식사 섭취 여부를 함께 확인해야 저혈당 원인과 지속 시간을 판단할 수 있습니다."
      },
      {
        key: "활력징후",
        sbarCategory: "A",
        keywordGroups: [
          ["BP", "혈압"],
          ["HR", "맥박", "122"]
        ],
        hint: "혈압, 맥박",
        followUpQuestion: "혈압이랑 맥박은 어떠세요?",
        rationale: "빈맥은 저혈당에 대한 신체의 대상 반응(카테콜아민 분비)을 반영하는 중요한 지표입니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["방문", "즉시", "확인 부탁", "지시", "처방"],
        hint: "즉시 방문 요청",
        followUpQuestion: "지금 즉시 봐주실 수 있을까요?",
        rationale: "의식소실을 동반한 중증 저혈당은 응급 상황이므로, 특정 처치를 지정하기보다 즉시 방문이 필요하다는 긴급도를 명확히 전달하는 것이 우선입니다."
      }
    ]
  },

  {
    id: "scn_15",
    title: "패혈성 쇼크 초기 징후 노티",
    partnerName: "권도윤",
    partnerRole: "의사",
    level: 3,
    levelLabel: "고급",
    closingLineNoR: "지금 바로 가겠습니다. 응급 코드 발동할게요.",
    trigger: "1201호 유금옥님, 요로감염 치료 중 갑자기 저혈압, 빈맥, 고열, 의식 혼미 발생",
    eventTime: "02:20",
    patient: {
      room: "1201호",
      name: "유금옥",
      ageSex: "76세/F",
      diagnosis: "요로감염(UTI)으로 항생제 치료 중",
      pod: null
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "02:22" }
    ],
    chartData: {
      VS: "이전(22:00) BP 118/74, HR 88, RR 18, BT 37.8, SpO2 97% · 현재(02:20) BP 82/54, HR 128, RR 26, BT 39.5, SpO2 93%",
      Lab: "어제 20:00 시행 - WBC 18,500 (상승), CRP 15.2 (상승), Lactate 결과 대기중",
      Meds: "세프트리악손 IV 투여 중(어제부터 시작)",
      IO: "intake 900ml · output 200ml(최근 4시간), 소변량 감소",
      Symptoms: "의식 혼미(질문에 지연 반응), 사지 냉감, 피부 얼룩덜룩함(mottling)",
      Treatment: "즉시 수액 개방, 활력징후 재측정 완료, 혈액배양 검사 시행 전"
    },
    requiredElements: [
      {
        key: "병실확인",
        sbarCategory: "S",
        keywords: ["1201"],
        hint: "병실 번호",
        followUpQuestion: "몇 호실이세요?",
        rationale: "병실을 밝히지 않으면 의사가 어느 환자를 말하는지 바로 특정하기 어렵습니다."
      },
      {
        key: "환자성명확인",
        sbarCategory: "S",
        keywords: ["유금옥"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "감염배경",
        sbarCategory: "B",
        keywords: ["요로감염", "UTI", "항생제"],
        hint: "감염원(요로감염) 및 항생제 치료 여부",
        followUpQuestion: "원래 어떤 감염으로 치료 중이셨어요?",
        rationale: "기존 감염원을 알아야 패혈증의 원인을 신속히 추정하고 항생제 조정 여부를 판단할 수 있습니다."
      },
      {
        key: "활력징후변화",
        sbarCategory: "A",
        keywordGroups: [
          ["BP", "혈압", "82"],
          ["HR", "맥박", "128"],
          ["BT", "체온", "39.5"]
        ],
        hint: "이전 대비 혈압·맥박·체온 변화",
        followUpQuestion: "이전이랑 비교해서 혈압, 맥박, 체온 어떻게 변했어요?",
        rationale: "저혈압, 빈맥, 고열이 동시에 나타나는 것은 패혈성 쇼크의 전형적 신호로, 셋 중 하나만 봐서는 놓칠 수 있습니다."
      },
      {
        key: "의식변화",
        sbarCategory: "A",
        keywords: ["혼미", "의식", "지연 반응", "처짐"],
        hint: "의식 수준 변화",
        followUpQuestion: "의식 상태는 어떠세요?",
        rationale: "의식 변화는 패혈증으로 인한 뇌 관류 저하를 시사하는 중요한 악화 신호입니다."
      },
      {
        key: "말초관류상태",
        sbarCategory: "A",
        keywords: ["냉감", "얼룩", "mottling", "차갑"],
        hint: "사지 냉감·피부 얼룩 등 말초 관류 상태",
        followUpQuestion: "손발이 차갑거나 피부색이 얼룩덜룩하지 않나요?",
        rationale: "말초 관류 저하 소견은 쇼크로 인한 조직 관류 부족을 시사하는 신체 사정 항목입니다."
      },
      {
        key: "소변량감소",
        sbarCategory: "A",
        keywords: ["소변량", "감소", "output"],
        hint: "최근 소변량 감소 여부",
        followUpQuestion: "최근 소변량은 어때요?",
        rationale: "핍뇨는 쇼크로 인한 신장 관류 저하를 반영하는 중요한 지표입니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["방문", "즉시", "확인 부탁", "지시", "처방", "수액"],
        hint: "즉시 방문 및 처치 요청",
        followUpQuestion: "지금 즉시 봐주실 수 있을까요?",
        rationale: "패혈성 쇼크는 인지 즉시 수액 소생과 항생제 조정이 필요한 응급 상황이므로 신속한 요청이 생명과 직결됩니다."
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

/**
 * 대화창/상단바에 표시할 의사 이름 (예: 김민수의사)
 */
function getPartnerLabel(scenario) {
  const name = (scenario && scenario.partnerName) || "당직";
  return name.endsWith("의사") ? name : `${name}의사`;
}

/**
 * 환자 한 줄 요약 (호실·이름·진단·POD·발생시각)
 * diagnosis에 이미 POD가 있으면 pod 필드는 중복 표시하지 않음
 */
function formatPatientSummary(patient, eventTime) {
  if (!patient) return "";
  const who = [patient.room, patient.name, patient.ageSex ? `(${patient.ageSex})` : null]
    .filter(Boolean)
    .join(" ");
  const diagnosis = patient.diagnosis || "";
  const podAlreadyInDx = /POD\s*#?\s*\d+/i.test(diagnosis);
  let podLabel = patient.pod;
  if (podLabel != null && podLabel !== "" && !podAlreadyInDx) {
    // 숫자만 있으면 POD#N 형태로 표시
    if (typeof podLabel === "number" || /^\d+$/.test(String(podLabel))) {
      podLabel = `POD#${podLabel}`;
    }
  } else {
    podLabel = null;
  }
  const extras = [
    diagnosis ? `Dx. ${diagnosis}` : null,
    podLabel,
    eventTime ? `발생 ${eventTime}` : null
  ].filter(Boolean);
  return [who, ...extras].filter(Boolean).join(" · ");
}

/**
 * 목록 카드용 짧은 부제 — trigger 앞부분(환자 위치+상황)
 */
function getScenarioCardSubtitle(scenario) {
  return getScenarioListSituation(scenario);
}

/** 목록 왼쪽: 호실 + 이름 + 나이/성별 (일률) */
function getScenarioListPatientLine(scenario) {
  const p = (scenario && scenario.patient) || {};
  const rawName = p.name || "";
  const ageSex = p.ageSex ? "(" + p.ageSex + ")" : "";
  return [p.room, rawName, ageSex].filter(Boolean).join(" ");
}

/** 목록 오른쪽: 상황만 짧게 */
function getScenarioListSituation(scenario) {
  if (!scenario) return "";
  let sit = String(scenario.trigger || "");
  const p = scenario.patient || {};
  if (p.room) sit = sit.split(p.room).join("");
  if (p.name) sit = sit.split(p.name).join("");
  sit = sit.replace(/님/g, "");
  // (65세, M) / (80세, COPD) / (70세, 당뇨) 형태 제거
  sit = sit.replace(/\(\d+세[^)]*\)/g, "");
  sit = sit.replace(/^\s*,?\s*/, "");
  const commaIdx = sit.indexOf(",");
  if (commaIdx > 0) sit = sit.slice(0, commaIdx);
  sit = sit.trim().replace(/^\s+/, "");
  if (sit) return sit;
  return String(scenario.title || "").replace(/\s*노티$/, "").trim();
}
