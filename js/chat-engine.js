/**
 * 대화 진행 로직 뼈대
 * - 시나리오 목록 렌더
 * - 메시지 순차 출력
 * - 선택지 렌더 / 선택 처리
 * - (확장) 차트 확인 · 의사 질문 분기
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
  renderChartData(scenario.chartData, document.getElementById("chartArea"), session);

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
 * chartData 6개 카테고리 렌더 (클릭 시 상세 펼침)
 * @param {object} chartData
 * @param {HTMLElement} container
 * @param {object} [session] 확인 기록용 (선택)
 */
function renderChartData(chartData, container, session) {
  if (!container || !chartData) return;

  const categories = Object.keys(CHART_LABELS);
  container.innerHTML = `
    <h2 class="chart-panel__heading">환자 차트</h2>
    <p class="chart-panel__hint">카테고리를 눌러 내용을 확인하세요.</p>
    <div class="chart-tabs" id="chartTabs"></div>
    <div class="chart-detail" id="chartDetail" hidden></div>
  `;

  const tabsEl = container.querySelector("#chartTabs");
  const detailEl = container.querySelector("#chartDetail");

  categories.forEach((key) => {
    if (!(key in chartData)) return;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "chart-tab";
    tab.dataset.category = key;
    tab.textContent = CHART_LABELS[key];

    tab.addEventListener("click", () => {
      if (session) markCategoryChecked(session, key);
      tab.classList.add("chart-tab--checked");

      tabsEl.querySelectorAll(".chart-tab").forEach((t) => t.classList.remove("chart-tab--open"));
      tab.classList.add("chart-tab--open");

      detailEl.hidden = false;
      detailEl.innerHTML = `
        <div class="chart-detail__title">${escapeHtml(CHART_LABELS[key])}</div>
        <div class="chart-detail__body">${formatChartValue(chartData[key])}</div>
      `;
    });

    tabsEl.appendChild(tab);
  });
}

/** chartData 값을 HTML로 포맷 */
function formatChartValue(value) {
  if (value == null) return "";

  if (Array.isArray(value)) {
    return `<ul class="chart-list">${value
      .map((item) => `<li>${escapeHtml(String(item))}</li>`)
      .join("")}</ul>`;
  }

  if (typeof value === "object") {
    return `<dl class="chart-dl">${Object.entries(value)
      .map(
        ([k, v]) =>
          `<div class="chart-dl__row"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(String(v))}</dd></div>`
      )
      .join("")}</dl>`;
  }

  return `<p>${escapeHtml(String(value))}</p>`;
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
    step: "chart", // trigger → chart → call → notify → feedback
    checkedCategories: [],
    selectedChoiceId: null,
    ...options
  };

  // TODO: Step 3 — doctorQuestions 분기 (ifChecked / ifNotChecked)
  // TODO: Step 4 — playMessages → renderChoices
  // TODO: Step 5 — 피드백 + SBAR 배지

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

/**
 * 차트 카테고리 확인 기록 (세션 로컬)
 * @param {object} session
 * @param {string} category  VS | Lab | Meds | IO | Symptoms | Treatment
 */
function markCategoryChecked(session, category) {
  if (!session.checkedCategories.includes(category)) {
    session.checkedCategories.push(category);
  }
  // TODO: state.checkChartCategory(session.scenario.id, category)
  return session.checkedCategories;
}

/**
 * 의사 질문에 대한 답변 옵션 반환
 * @param {object} question  doctorQuestions 항목
 * @param {string[]} checkedCategories
 */
function getDoctorAnswerOption(question, checkedCategories) {
  const checked = checkedCategories.includes(question.category);
  return checked ? question.ifChecked : question.ifNotChecked;
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
