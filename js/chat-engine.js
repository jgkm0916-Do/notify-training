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

const AVATAR_COLORS = ["#4a90d9","#5dade2","#48c9b0","#58d68d","#f5b041","#af7ac5","#e59866"];

/** index.html — 카톡형 채팅방 목록 */
function renderScenarioList(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof scenarios === "undefined") return;

  el.innerHTML = "";

  const sorted = scenarios.slice().sort((a, b) => {
    const la = Number(a.level) || 99;
    const lb = Number(b.level) || 99;
    if (la !== lb) return la - lb;
    return String(a.id).localeCompare(String(b.id));
  });

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
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const level = Number(s.level) || 0;
    const levelLabel = s.levelLabel || "";
    const levelBadge = levelLabel
      ? '<span class="chat-room__level chat-room__level--' + level + '">' + escapeHtml(levelLabel) + '</span>'
      : "";

    row.innerHTML =
      '<div class="chat-room__avatar" style="background:' + color + '">' + escapeHtml(initial) + '</div>' +
      '<div class="chat-room__body">' +
        '<div class="chat-room__top">' +
          '<div class="chat-room__preview">' +
            '<span class="chat-room__preview-text">' + escapeHtml(patientLine) + '</span>' +
            levelBadge +
          '</div>' +
          '<div class="chat-room__situation">' + escapeHtml(situation) + '</div>' +
        '</div>' +
        '<div class="chat-room__name">' + escapeHtml(partnerLabel) + '</div>' +
      '</div>' +
      '<span class="chat-room__badge" aria-label="새 메시지">1</span>';

    row.addEventListener("click", () => {
      window.location.href = "scenario.html?id=" + encodeURIComponent(s.id);
    });
    el.appendChild(row);
  });
}


/**
 * scenario.html — URL ?id= 로 시나리오 로드 후 trigger / chartData 렌더
 */
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
}

/**
 * 사용자 메시지 전송 → 누락 시 의사 후속 질문 → 최종 평가
 * 되묻기 횟수 상한: getMaxFollowUps(requiredElements)
 */
function handleNotifySubmit(session, text, chatBody, feedbackSlot, partnerLabel) {
  if (!session || session.notifyFinished || !text?.trim()) return { done: false };

  const message = text.trim();
  session.notifyTexts.push(message);

  appendMessage(chatBody, { sender: "me", text: message, time: nowHHMM() });

  const combined = session.notifyTexts.join(" ");
  // session.requiredElements는 없음 → scenario에 붙어 있음
  const elements = session.scenario?.requiredElements || [];
  const grade = gradeNotifyText(combined, elements);
  session.lastGrade = grade;
  session.notifyText = combined;

  const missed = getMissedForFollowUp(grade, session.askedKeys);
  const maxFollowUps = getMaxFollowUps(elements);

  if (session.followUpCount < maxFollowUps && missed.length > 0) {
    const target = missed[0];
    const sourceEl = elements.find((e) => e.key === target.key) || target;
    session.askedKeys.push(target.key);
    session.followUpCount += 1;

    const question = buildFollowUpQuestion(sourceEl);
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

  renderNotifyFeedback(grade, feedbackSlot, {
    title: "최종 평가",
    lead: `총 ${session.notifyTexts.length}번의 메시지를 바탕으로 평가했습니다.`,
    elements
  });

  scrollChatToBottom(chatBody);
}

function renderNotifyFeedback(grade, container, options = {}) {
  if (!container || !grade) return;

  const elements = options.elements || [];
  const rMissNotice = getRecommendationMissNotice(grade, elements);

  const title = options.title || `${grade.includedCount}/${grade.total} 항목 포함`;
  const lead = options.lead || "보낸 노티를 항목별로 살펴본 결과입니다.";

  const hitItems = (grade.checklist || []).filter((i) => i.included);
  const missItems = (grade.checklist || []).filter((i) => !i.included);

  const renderItem = (item) => {
    const hit = item.included;
    const label = hit ? "맞음" : "보완 필요";
    const rationaleHtml =
      !hit && item.rationale
        ? `<p class="feedback-checklist__rationale">${escapeHtml(item.rationale)}</p>`
        : "";
    return `
      <li class="feedback-checklist__item ${hit ? "feedback-checklist__item--hit" : "feedback-checklist__item--miss"}">
        <div class="feedback-checklist__row">
          <span class="feedback-checklist__mark">${hit ? "✓" : "✗"}</span>
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
      <p class="feedback-checklist__lead">${escapeHtml(lead)}</p>
      ${
        rMissNotice
          ? `<p class="feedback-checklist__r-notice">${escapeHtml(rMissNotice)}</p>`
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
