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
    trigger: "802호 김OO님 침상에서 낙상, 침상 난간에 후두부를 부딪힘. 신규간호사인 당신이 발견",
    eventTime: "03:08",

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
        keywords: ["김", "성함"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 호실·동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
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
    trigger: "701호 박OO님(65세, M) 갑작스러운 흉통 호소, 좌측 방사통 동반",
    eventTime: "14:20",
    patient: {
      room: "701호",
      name: "박OO",
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
        keywords: ["박", "성함"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 호실·동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
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
    trigger: "903호 이OO님(80세, COPD) 갑자기 호흡곤란 호소, SpO2 88%로 저하",
    eventTime: "22:15",
    patient: {
      room: "903호",
      name: "이OO",
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
        keywords: ["이", "성함"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 호실·동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
      },
      {
        key: "발생시각",
        sbarCategory: "S",
        keywords: ["22:15", "10시 15", "22시"],
        hint: "호흡곤란이 발생한 시각(22:15)을 포함하세요.",
        rationale: "발생 시각이 있어야 증상 진행 속도와 응급 개입 시점을 판단할 수 있습니다."
      },
      {
        key: "SpO2수치",
        sbarCategory: "S",
        keywords: ["88", "산소포화도", "SpO2"],
        hint: "구체적 산소포화도 수치가 핵심 정보입니다.",
        rationale: "구체 SpO2는 저산소증 심각도를 보여 주며, 수치 없이 보고하면 산소 증량·응급도를 판단하기 어렵습니다."
      },
      {
        key: "호흡수",
        sbarCategory: "A",
        keywords: ["호흡수", "RR", "30"],
        hint: "호흡수 변화는 상태 평가에 필수입니다.",
        rationale: "호흡수 증가는 호흡부전 진행을 반영하는 핵심 평가 항목입니다."
      },
      {
        key: "산소요법현황",
        sbarCategory: "B",
        keywords: ["산소", "리터", "L", "캐뉼라"],
        hint: "현재 적용 중인 산소요법 정보가 빠지면 의사가 조치를 판단하기 어렵습니다.",
        rationale: "현재 산소 유량·적용 방식을 알아야 추가 산소·ABGA·방문 필요성을 판단할 수 있습니다."
      },
      {
        key: "요청사항",
        sbarCategory: "R",
        keywords: ["처방", "요청", "봐주세요", "와주세요"],
        hint: "다음 조치를 명확히 요청해야 합니다.",
        rationale: "원하는 다음 조치를 명시해야 의사가 즉시 처방·방문 여부를 결정할 수 있습니다."
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
    trigger: "605호 최OO님(55세) 발열 및 오한 호소, 최근 요로감염 병력",
    eventTime: "06:40",
    patient: {
      room: "605호",
      name: "최OO",
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
        keywords: ["최", "성함"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 호실·동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
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
    trigger: "502호 정OO님(70세, 당뇨) 식은땀 및 의식저하, 혈당 45mg/dL 측정",
    eventTime: "08:00",
    patient: {
      room: "502호",
      name: "정OO",
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
        keywords: ["정", "성함"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 호실·동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
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
    trigger: "1005호 한OO님 수혈 시작 15분 후 오한 및 두드러기 발생",
    eventTime: "16:45",
    patient: {
      room: "1005호",
      name: "한OO",
      ageSex: "62세/F",
      diagnosis: "위암 수술 후",
      pod: "POD#2"
    },
    messages: [
      { sender: "partner", text: "네, 말씀하세요.", time: "16:47" }
    ],
    chartData: {
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
        keywords: ["한", "성함"],
        hint: "환자 성명",
        followUpQuestion: "환자분 성함이 어떻게 되세요?",
        rationale: "성명을 함께 말하면 호실·동명이인 혼동을 줄이고 환자 확인이 확실해집니다."
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
 */
function formatPatientSummary(patient, eventTime) {
  if (!patient) return "";
  const who = [patient.room, patient.name, patient.ageSex ? `(${patient.ageSex})` : null]
    .filter(Boolean)
    .join(" ");
  const extras = [
    patient.diagnosis ? `Dx. ${patient.diagnosis}` : null,
    patient.pod || null,
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

/** 목록 왼쪽: 호실 + 이름 + 나이 (일률) */
function getScenarioListPatientLine(scenario) {
  const p = (scenario && scenario.patient) || {};
  const age = String(p.ageSex || "").split("/")[0].trim();
  const rawName = p.name || "";
  const name = rawName ? (rawName.endsWith("님") ? rawName : rawName + "님") : "";
  return [p.room, name, age ? "(" + age + ")" : ""].filter(Boolean).join(" ");
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
