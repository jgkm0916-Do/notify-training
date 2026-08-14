/**
 * 대화 진행 로직
 * - 시나리오 목록 렌더
 * - 차트 전체 펼침
 * - 메시지 출력
 */

const CHART_LABELS = {
  VS: "V/S",
  Lab: "최근 Lab",
  Meds: "투약",
  IO: "I/O",
  Symptoms: "증상",
  Treatment: "처치"
};

/** index.html — 시나리오 카드 목록 + 클릭 이동 */
function renderScenarioList(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof scenarios === "undefined") return;

  el.innerHTML = "";

  scenarios.forEach((s) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "scenario-card";
    card.dataset.scenarioId = s.id;
    card.innerHTML = `
      <div class="scenario-card__title">${escapeHtml(s.title)}</div>
      <div class="scenario-card__subtitle">${escapeHtml(s.subtitle || s.trigger || "")}</div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `scenario.html?id=${encodeURIComponent(s.id)}`;
    });
    el.appendChild(card);
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
  renderTrigger(scenario.trigger, document.getElementById("triggerArea"));
  renderChartData(scenario.chartData, document.getElementById("chartArea"));

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
function renderTrigger(trigger, container) {
  if (!container) return;
  container.innerHTML = `
    <div class="trigger-banner">
      <p class="trigger-banner__label">상황 발생</p>
      <p class="trigger-banner__text">${escapeHtml(trigger || "")}</p>
    </div>
  `;
}

/**
 * chartData 6개 카테고리를 처음부터 모두 펼쳐 카드로 나열
 * @param {object} chartData
 * @param {HTMLElement} container
 */
function renderChartData(chartData, container) {
  if (!container || !chartData) return;

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
 */
function appendMessage(container, msg) {
  const isMe = msg.sender === "me";
  const wrap = document.createElement("div");
  wrap.className = `msg ${isMe ? "msg--me" : "msg--partner"}`;
  wrap.innerHTML = `
    <div class="msg__bubble">${escapeHtml(msg.text)}</div>
    ${msg.time ? `<div class="msg__time">${escapeHtml(msg.time)}</div>` : ""}
  `;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
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
