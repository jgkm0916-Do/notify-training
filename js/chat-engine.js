/**
 * 대화 진행 로직
 * - 시나리오 목록 렌더
 * - 차트 전체 펼침
 * - 메시지 출력
 */

const CHART_LABELS = {
  VS: "V/S",
  Lab: "Lab",
  Meds: "투약",
  IO: "I/O",
  Symptoms: "증상",
  Treatment: "처치"
};

const AVATAR_COLORS = [
  "#4a90d9",
  "#5dade2",
  "#48c9b0",
  "#58d68d",
  "#f5b041",
  "#af7ac5",
  "#e59866",
  "#5c6bc0",
  "#26a69a",
  "#ef5350",
  "#7e57c2",
  "#42a5f5",
  "#8d6e63",
  "#78909c",
  "#ec407a"
];

/** 미리보기용 짧은 상황명 (예: 낙상, 저혈당) */
function getScenarioPreviewLabel(scenario) {
  if (!scenario) return "";
  let label = String(scenario.title || "")
    .replace(/\s*노티$/, "")
    .replace(/\s*발생$/, "")
    .replace(/\s*의심$/, "")
    .trim();
  if (!label && typeof getScenarioListSituation === "function") {
    label = getScenarioListSituation(scenario);
  }
  return label || scenario.id || "";
}

function getScenariosByLevel(level) {
  if (typeof scenarios === "undefined") return [];
  const lv = Number(level) || 1;
  return scenarios
    .filter((s) => Number(s.level) === lv)
    .slice()
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

const LEVEL_LABELS = { 1: "초급", 2: "중급", 3: "고급" };

function fillLevelCardPreviews() {
  [1, 2, 3].forEach((level) => {
    const list = getScenariosByLevel(level);
    const previewEl = document.querySelector('[data-preview-for="' + level + '"]');
    const countEl = document.querySelector('[data-count-for="' + level + '"]');
    if (countEl) {
      countEl.textContent = list.length ? list.length + "개" : "";
    }
    if (previewEl) {
      previewEl.textContent = list.length
        ? list.map((s, i) => i + 1 + ". " + getScenarioPreviewLabel(s)).join("  ")
        : "시나리오 준비 중";
    }
  });
}

function showHomeLanding() {
  const landing = document.getElementById("homeLanding");
  const levelView = document.getElementById("homeLevel");
  if (landing) landing.hidden = false;
  if (levelView) levelView.hidden = true;
  fillLevelCardPreviews();
}

function enterLevelView(level) {
  const landing = document.getElementById("homeLanding");
  const levelView = document.getElementById("homeLevel");
  const titleEl = document.getElementById("levelViewTitle");
  const lv = Number(level) || 1;

  if (landing) landing.hidden = true;
  if (levelView) levelView.hidden = false;
  if (titleEl) titleEl.textContent = LEVEL_LABELS[lv] || "시나리오";

  renderScenarioList("scenarioList", { level: lv });
  window.scrollTo(0, 0);
}

/** index.html — 메인(난이도 탭) → 탭 진입 후 시나리오 목록 */
function initHomePage() {
  if (typeof scenarios === "undefined") return;

  showHomeLanding();

  const cards = document.getElementById("levelCards");
  if (cards) {
    cards.addEventListener("click", (e) => {
      const btn = e.target.closest(".level-card");
      if (!btn) return;
      enterLevelView(btn.dataset.level);
    });
  }

  const backBtn = document.getElementById("backToHomeBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => showHomeLanding());
  }
}

/** index.html — 카톡형 채팅방 목록 (level 옵션 시 해당 난이도만) */
function renderScenarioList(containerId, options = {}) {
  const el = document.getElementById(containerId);
  if (!el || typeof scenarios === "undefined") return;

  el.innerHTML = "";

  const filterLevel =
    options.level != null && options.level !== ""
      ? Number(options.level)
      : null;

  const sorted = (
    filterLevel != null ? getScenariosByLevel(filterLevel) : scenarios.slice()
  ).sort((a, b) => {
    if (filterLevel == null) {
      const la = Number(a.level) || 99;
      const lb = Number(b.level) || 99;
      if (la !== lb) return la - lb;
    }
    return String(a.id).localeCompare(String(b.id));
  });

  if (!sorted.length) {
    el.innerHTML =
      '<p class="chat-room-list__empty">이 난이도 시나리오가 아직 없습니다.</p>';
    return;
  }

  sorted.forEach((s, index) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "chat-room";
    row.dataset.scenarioId = s.id;

    const partnerLabel =
      typeof getPartnerLabel === "function"
        ? getPartnerLabel(s)
        : (s.partnerName || "당직") + "의사";
    const patientLine =
      typeof getScenarioListPatientLine === "function"
        ? getScenarioListPatientLine(s)
        : s.title || "";
    const situation =
      typeof getScenarioListSituation === "function"
        ? getScenarioListSituation(s)
        : s.subtitle || "";
    const initial = (s.partnerName || partnerLabel || "?").charAt(0);

    const colorIndex = Math.max(0, scenarios.findIndex((x) => x.id === s.id));
    const color =
      AVATAR_COLORS[(colorIndex >= 0 ? colorIndex : index) % AVATAR_COLORS.length];

    row.innerHTML =
      '<div class="chat-room__avatar" style="background:' +
      color +
      '">' +
      escapeHtml(initial) +
      "</div>" +
      '<div class="chat-room__body">' +
      '<div class="chat-room__top">' +
      '<div class="chat-room__preview">' +
      '<span class="chat-room__preview-text">' +
      escapeHtml(patientLine) +
      "</span></div>" +
      '<div class="chat-room__situation">' +
      escapeHtml(situation) +
      "</div></div>" +
      '<div class="chat-room__name">' +
      escapeHtml(partnerLabel) +
      "</div></div>" +
      '<span class="chat-room__badge" aria-label="새 메시지">1</span>';

    row.addEventListener("click", () => {
      window.location.href = "scenario.html?id=" + encodeURIComponent(s.id);
    });
    el.appendChild(row);
  });
}

function initScenarioPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showScenarioError("시나리오 ID가 없습니다. 목록에서 다시 선택해 주세요.");
    return null;
  }

  const scenario = getScenarioById(id);
  if (!scenario) {
    showScenarioError(`시나리오를 찾을 수 없습니다. (id: ${id})`);
    return null;
  }

  const titleEl = document.getElementById("scenarioTitle");
  if (titleEl) titleEl.textContent = scenario.title;

  const session = startScenario(id);
  renderTrigger(scenario, document.getElementById("triggerArea"));
  renderPracticeHistory(id, document.getElementById("triggerArea"));
  renderChartData(scenario.chartData, document.getElementById("chartArea"), scenario);

  return session;
}

function showScenarioError(message) {
  const main = document.getElementById("scenarioMain");
  if (main) {
    main.innerHTML = `
      <div class="scenario-error">
        <p>${escapeHtml(message)}</p>
        <a class="btn-primary" href="index.html">목록으로 돌아가기</a>
      </div>
    `;
  }
}

/** 상황 발생(trigger) 안내 */
function renderTrigger(scenario, container) {
  if (!container) return;
  const trigger = typeof scenario === "string" ? scenario : scenario?.trigger;
  const eventTime = typeof scenario === "object" ? scenario?.eventTime : "";
  container.innerHTML = `
    <div class="trigger-banner">
      <p class="trigger-banner__label">상황 발생${eventTime ? ` · ${escapeHtml(eventTime)}` : ""}</p>
      <p class="trigger-banner__text">${escapeHtml(trigger || "")}</p>
    </div>
  `;
}

/* ===== 연습 기록 (localStorage) ===== */

function notifyHistoryKey(scenarioId) {
  return `notifyHistory_${scenarioId}`;
}

function getNotifyHistory(scenarioId) {
  if (!scenarioId) return [];
  try {
    const raw = localStorage.getItem(notifyHistoryKey(scenarioId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[notify-history] load failed", err);
    return [];
  }
}

function saveNotifyHistory(scenarioId, history) {
  if (!scenarioId) return;
  try {
    localStorage.setItem(notifyHistoryKey(scenarioId), JSON.stringify(history));
  } catch (err) {
    console.warn("[notify-history] save failed", err);
  }
}

/**
 * 최종 채점 결과를 시나리오별 연습 기록에 append
 * @returns {{ previous: object|null, current: object, history: object[] }}
 */
function recordNotifyAttempt(scenarioId, session, grade) {
  const history = getNotifyHistory(scenarioId);
  const previous = history.length ? history[history.length - 1] : null;

  const requiredItems = (grade?.checklist || []).filter((i) => i.required !== false);
  const missedKeys = requiredItems.filter((i) => !i.included).map((i) => i.key);

  const current = {
    timestamp: new Date().toISOString(),
    followUpCount: session?.followUpCount || 0,
    passedItems: grade?.includedCount || 0,
    totalItems: grade?.total || requiredItems.length,
    missedKeys
  };

  history.push(current);
  saveNotifyHistory(scenarioId, history);
  return { previous, current, history };
}

/** 직전 시도 대비 한 줄 비교 문구 (직전 없으면 "") */
function buildHistoryComparison(previous, current) {
  if (!previous || !current) return "";

  const followDiff = (previous.followUpCount || 0) - (current.followUpCount || 0);
  const passDiff = (current.passedItems || 0) - (previous.passedItems || 0);

  let followPart;
  if (followDiff > 0) {
    followPart = `되묻기 ${followDiff}번 줄었고`;
  } else if (followDiff < 0) {
    followPart = `되묻기 ${Math.abs(followDiff)}번 늘었고`;
  } else {
    followPart = "되묻기 횟수는 비슷하고";
  }

  let passPart;
  if (passDiff > 0) {
    passPart = `통과 항목이 ${passDiff}개 늘었어요.`;
  } else if (passDiff < 0) {
    passPart = `통과 항목이 ${Math.abs(passDiff)}개 줄었어요.`;
  } else {
    passPart = "통과 항목 수는 비슷해요.";
  }

  return `지난번보다 ${followPart}, ${passPart}`;
}

/** 시나리오 시작 화면 — 이전 연습 기록 요약 (없으면 숨김) */
function renderPracticeHistory(scenarioId, container) {
  if (!container || !scenarioId) return;

  const existing = container.querySelector(".practice-history");
  if (existing) existing.remove();

  const history = getNotifyHistory(scenarioId);
  if (!history.length) return;

  const nextRound = history.length + 1;
  const recent = history.slice(-3).reverse();

  const rows = recent
    .map((entry, i) => {
      const round = history.length - i;
      const follow = entry.followUpCount || 0;
      const passed = entry.passedItems || 0;
      const total = entry.totalItems || 0;
      return `<li class="practice-history__item">${round}회 · 되묻기 ${follow}번 · ${passed}/${total} 항목</li>`;
    })
    .join("");

  const wrap = document.createElement("div");
  wrap.className = "practice-history";
  wrap.innerHTML = `
    <p class="practice-history__title">이 시나리오 ${nextRound}번째 연습이에요</p>
    <ul class="practice-history__list">${rows}</ul>
  `;
  container.appendChild(wrap);
}

/**
 * chartData 6개 카테고리를 처음부터 모두 펼쳐 카드로 나열
 * @param {object} chartData
 * @param {HTMLElement} container
 * @param {object} [scenario] 환자 식별(진단·POD) 표시용
 */
function renderChartData(chartData, container, scenario) {
  if (!container || !chartData) return;

  const patientLine = scenario?.patient
    ? `<div class="patient-banner">${escapeHtml(formatPatientSummary(scenario.patient, scenario.eventTime))}</div>`
    : "";

  const cards = Object.keys(CHART_LABELS)
    .filter((key) => key in chartData)
    .map(
      (key) => `
      <article class="chart-card">
        <h3 class="chart-card__title">${escapeHtml(CHART_LABELS[key])}</h3>
        <div class="chart-card__body">${formatChartValue(chartData[key])}</div>
      </article>`
    )
    .join("");

  container.innerHTML = `
    <h2 class="chart-panel__heading">환자 차트</h2>
    ${patientLine}
    <div class="chart-cards">${cards}</div>
  `;
}

/** chartData 값을 한눈에 들어오는 한 줄 요약으로 포맷 */
function formatChartValue(value) {
  if (value == null) return "";

  if (Array.isArray(value)) {
    return `<p class="chart-card__text">${escapeHtml(value.join(", "))}</p>`;
  }

  if (typeof value === "object") {
    const parts = Object.entries(value).map(([k, v]) => {
      const label = String(k).replace(/^최근\s*/, "");
      return `${label} ${v}`;
    });
    return `<p class="chart-card__text">${escapeHtml(parts.join(" · "))}</p>`;
  }

  return `<p class="chart-card__text">${escapeHtml(String(value))}</p>`;
}

/**
 * 시나리오 채팅 세션 시작 (scenario.html에서 호출)
 * @param {string} scenarioId
 * @param {object} [options]
 */
function startScenario(scenarioId, options = {}) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    console.error("[chat-engine] scenario not found:", scenarioId);
    return null;
  }

  const session = {
    scenario,
    step: "chart", // trigger → chart → notify → feedback
    ...options
  };

  return session;
}

/**
 * partner 메시지를 순차 출력
 * @param {Array<{sender:string,text:string,time:string}>} messages
 * @param {HTMLElement} container
 * @param {number} [delayMs=600]
 */
async function playMessages(messages, container, delayMs = 600) {
  if (!container || !messages) return;

  for (const msg of messages) {
    appendMessage(container, msg);
    await wait(delayMs);
  }
}

/**
 * 말풍선 DOM 추가
 * @param {HTMLElement} container
 * @param {{sender:string,text:string,time?:string,name?:string}} msg
 * @param {{partnerLabel?:string}} [options]
 */
function scrollChatToBottom(container) {
  if (!container) return;
  const scroller =
    (typeof container.closest === "function" && container.closest(".call-scroll")) ||
    container;
  requestAnimationFrame(() => {
    scroller.scrollTop = scroller.scrollHeight;
  });
}

function appendMessage(container, msg, options = {}) {
  const isMe = msg.sender === "me";
  const nameLabel = isMe ? "나" : msg.name || options.partnerLabel || "의사";
  const wrap = document.createElement("div");
  wrap.className = `msg ${isMe ? "msg--me" : "msg--partner"}`;
  wrap.innerHTML = `
    <div class="msg__name">${escapeHtml(nameLabel)}</div>
    <div class="msg__bubble">${escapeHtml(msg.text)}</div>
    ${msg.time ? `<div class="msg__time">${escapeHtml(msg.time)}</div>` : ""}
  `;
  container.appendChild(wrap);
  scrollChatToBottom(container);
}

/**
 * 선택지 버튼 렌더
 * @param {object} scenario
 * @param {HTMLElement} container
 * @param {(choice: object) => void} onSelect
 */
function renderChoices(scenario, container, onSelect) {
  if (!container || !scenario?.choices) return;

  container.innerHTML = "";
  scenario.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => {
      container.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));
      onSelect(choice);
    });
    container.appendChild(btn);
  });
}

/**
 * 선택 후: 내 말풍선 표시 + 피드백 카드
 * @param {object} choice
 * @param {HTMLElement} chatBody
 * @param {HTMLElement} [feedbackSlot]
 */
function handleChoiceSelect(choice, chatBody, feedbackSlot) {
  appendMessage(chatBody, {
    sender: "me",
    text: choice.text,
    time: nowHHMM()
  });

  if (feedbackSlot) {
    renderFeedback(choice, feedbackSlot);
  }

  // TODO: state.saveAnswer(scenarioId, choice.id, choice.sbarScore)
  return choice;
}

/**
 * SBAR 피드백 카드
 */
function renderFeedback(choice, container) {
  const score = choice.sbarScore || { S: 0, B: 0, A: 0, R: 0 };
  const total = score.S + score.B + score.A + score.R;
  const ok = total === 4;

  container.innerHTML = `
    <div class="feedback-card ${ok ? "feedback-card--ok" : "feedback-card--bad"}">
      <strong>${ok ? "적절한 노티" : "보완이 필요한 노티"}</strong>
      <p>${escapeHtml(choice.feedback || "")}</p>
      <div class="feedback-card__sbar">
        ${["S", "B", "A", "R"]
          .map(
            (k) =>
              `<span class="sbar-badge ${score[k] ? "sbar-badge--hit" : "sbar-badge--miss"}">${k}: ${score[k] ? "O" : "X"}</span>`
          )
          .join("")}
      </div>
    </div>
  `;
}

/* ===== 노티 대화형 후속 질문 ===== */

function initNotifyConversation(session) {
  session.notifyTexts = [];
  session.followUpCount = 0;
  session.askedKeys = [];
  session.notifyFinished = false;
  session.pendingFollowUpKey = null;
  session.confirmedFollowUpKeys = [];
}

/**
 * 사용자 메시지 전송 → 누락 시 의사 후속 질문 → 최종 평가
 * 되묻기 횟수 상한: getMaxFollowUps(requiredElements)
 *
 * 의사가 follow-up을 던지면 session.pendingFollowUpKey에 대상 element key를 저장.
 * 다음 간호사 메시지가 짧은 긍정이면 해당 key를 confirmedFollowUpKeys에 넣어 채점에 반영.
 */
function handleNotifySubmit(session, text, chatBody, feedbackSlot, partnerLabel) {
  if (!session || session.notifyFinished || !text?.trim()) return { done: false };

  const message = text.trim();
  session.notifyTexts.push(message);

  appendMessage(chatBody, { sender: "me", text: message, time: nowHHMM() });

  if (!Array.isArray(session.confirmedFollowUpKeys)) {
    session.confirmedFollowUpKeys = [];
  }

  const pendingKey = session.pendingFollowUpKey || null;
  if (pendingKey) {
    if (
      typeof isAffirmativeReply === "function" &&
      isAffirmativeReply(message)
    ) {
      if (!session.confirmedFollowUpKeys.includes(pendingKey)) {
        session.confirmedFollowUpKeys.push(pendingKey);
      }
    }
    // 긍정·부정·그 외 답변 모두 대기 질문 소진
    session.pendingFollowUpKey = null;
  }

  const combined = session.notifyTexts.join(" ");
  // session.requiredElements는 없음 → scenario에 붙어 있음
  const elements = session.scenario?.requiredElements || [];
  const grade = gradeNotifyText(combined, elements, {
    forceIncludedKeys: session.confirmedFollowUpKeys
  });
  session.lastGrade = grade;
  session.notifyText = combined;

  const missed = getMissedForFollowUp(grade, session.askedKeys);
  const maxFollowUps = getMaxFollowUps(elements);

  if (session.followUpCount < maxFollowUps && missed.length > 0) {
    const followUp =
      typeof buildNotifyFollowUp === "function"
        ? buildNotifyFollowUp(grade, missed, elements, session.askedKeys)
        : null;
    const question =
      (followUp && followUp.question) ||
      buildFollowUpQuestion(
        elements.find((e) => e.key === missed[0].key) || missed[0]
      );
    const keysToAdd =
      followUp && followUp.askedKeysToAdd && followUp.askedKeysToAdd.length
        ? followUp.askedKeysToAdd
        : [missed[0].key];
    keysToAdd.forEach((k) => {
      if (!session.askedKeys.includes(k)) session.askedKeys.push(k);
    });
    session.followUpCount += 1;
    session.pendingFollowUpKey =
      (followUp &&
        followUp.targets &&
        followUp.targets[0] &&
        followUp.targets[0].key) ||
      missed[0].key;

    window.setTimeout(() => {
      appendMessage(
        chatBody,
        { sender: "partner", text: question, time: nowHHMM() },
        { partnerLabel }
      );
      scrollChatToBottom(chatBody);
    }, 450);

    return { done: false, followUp: true, question };
  }

  finishNotifyConversation(session, grade, chatBody, feedbackSlot, partnerLabel);
  return { done: true };
}

function finishNotifyConversation(session, grade, chatBody, feedbackSlot, partnerLabel) {
  session.notifyFinished = true;
  session.step = "feedback";

  const elements = session.scenario.requiredElements || [];
  const closingText = buildDoctorClosingMessage(grade, elements, session.scenario);

  appendMessage(
    chatBody,
    { sender: "partner", text: closingText, time: nowHHMM() },
    { partnerLabel }
  );

  const scenarioId = session.scenario?.id;
  const { previous, current } = recordNotifyAttempt(scenarioId, session, grade);
  const comparison = buildHistoryComparison(previous, current);

  renderNotifyFeedback(grade, feedbackSlot, {
    title: "최종 평가",
    lead: `총 ${session.notifyTexts.length}번의 메시지를 바탕으로 평가했습니다.`,
    elements,
    comparison
  });

  scrollChatToBottom(chatBody);
}

function renderNotifyFeedback(grade, container, options = {}) {
  if (!container || !grade) return;

  const elements = options.elements || [];
  const rMissNotice = getRecommendationMissNotice(grade, elements);

  const title = options.title || `${grade.includedCount}/${grade.total} 항목 포함`;
  const lead = options.lead || "보낸 노티를 항목별로 살펴본 결과입니다.";
  const comparison = options.comparison || "";

  const requiredItems = (grade.checklist || []).filter((i) => i.required !== false);
  const optionalItems = (grade.checklist || []).filter((i) => i.required === false);
  const hitItems = requiredItems.filter((i) => i.included);
  const missItems = requiredItems.filter((i) => !i.included);
  const optionalFeedback =
    typeof getOptionalRequestFeedback === "function"
      ? getOptionalRequestFeedback(grade)
      : null;

  const renderItem = (item) => {
    const hit = item.included;
    const isOptional = item.required === false || item.optional;
    const label = hit ? "맞음" : isOptional ? "참고" : "보완 필요";
    const rationaleHtml =
      !hit && !isOptional && item.rationale
        ? `<p class="feedback-checklist__rationale">${escapeHtml(item.rationale)}</p>`
        : "";
    const itemClass = hit
      ? "feedback-checklist__item--hit"
      : isOptional
        ? "feedback-checklist__item--optional"
        : "feedback-checklist__item--miss";
    return `
      <li class="feedback-checklist__item ${itemClass}">
        <div class="feedback-checklist__row">
          <span class="feedback-checklist__mark">${hit ? "✓" : isOptional ? "·" : "✗"}</span>
          <span class="feedback-checklist__cat">${escapeHtml(item.sbarCategory || "")}</span>
          <span class="feedback-checklist__key">${escapeHtml(item.key || "")}</span>
          <span class="feedback-checklist__status">${label}</span>
        </div>
        <p class="feedback-checklist__explain">${escapeHtml(explainChecklistItem(item))}</p>
        ${rationaleHtml}
      </li>
    `;
  };

  container.innerHTML = `
    <div class="feedback-checklist">
      <div class="feedback-checklist__summary">${escapeHtml(title)}</div>
      ${
        comparison
          ? `<p class="feedback-checklist__compare">${escapeHtml(comparison)}</p>`
          : ""
      }
      <p class="feedback-checklist__lead">${escapeHtml(lead)}</p>
      ${
        rMissNotice
          ? `<p class="feedback-checklist__r-notice">${escapeHtml(rMissNotice)}</p>`
          : ""
      }
      ${
        optionalFeedback && !rMissNotice
          ? `<p class="feedback-checklist__optional-tip">${escapeHtml(optionalFeedback)}</p>`
          : ""
      }
      ${
        hitItems.length
          ? `<h3 class="feedback-checklist__section">맞은 항목</h3>
             <ul class="feedback-checklist__list">${hitItems.map(renderItem).join("")}</ul>`
          : ""
      }
      ${
        missItems.length
          ? `<h3 class="feedback-checklist__section">빠진·보완할 항목</h3>
             <ul class="feedback-checklist__list">${missItems.map(renderItem).join("")}</ul>`
          : `<p class="feedback-checklist__all-ok">필수 항목을 모두 포함했습니다.</p>`
      }
      ${
        optionalItems.length
          ? `<h3 class="feedback-checklist__section">선택·가산 항목</h3>
             <ul class="feedback-checklist__list">${optionalItems.map(renderItem).join("")}</ul>`
          : ""
      }
    </div>
  `;

  const scroller = container.closest(".call-scroll");
  if (scroller) {
    scrollChatToBottom(scroller);
  } else {
    container.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

/* ===== helpers ===== */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
