import type { CodeExample, Lesson, Tab } from "../types";
import { escapeHtml } from "../utils/html";
import { highlightCode } from "./code-highlight";

type RenderContext = {
  lessons: Lesson[];
  activeLessonId: string;
  activeTab: Tab;
  completedLessons: Set<string>;
  completeCount: number;
  completePercent: number;
};

export function renderAppView(context: RenderContext): string {
  const lesson = getActiveLesson(context);

  return `
    <div class="app-shell">
      <aside class="sidebar" aria-label="课程列表">
        <div class="brand">
          <img class="brand-logo" src="${withBase("icons/graphql-logo.svg")}" alt="" />
          <div>
            <h1 class="eyebrow">GraphQL</h1>  
            <p>Practice Lab</p>
          </div>
        </div>

        <label class="mobile-picker">
          <span>当前课程</span>
          <select data-lesson-select>
            ${context.lessons
              .map(
                (item) => `
                  <option value="${item.id}" ${item.id === lesson.id ? "selected" : ""}>
                    ${item.number}. ${escapeHtml(item.title)}
                  </option>
                `,
              )
              .join("")}
          </select>
        </label>

        <div class="progress-panel" aria-label="学习进度">
          <div class="progress-copy">
            <span>${context.completeCount} / ${context.lessons.length} 已完成</span>
            <strong>${context.completePercent}%</strong>
          </div>
          <div class="progress-track"><span style="width: ${context.completePercent}%"></span></div>
        </div>

        <nav class="course-list" aria-label="桌面课程列表">
          ${context.lessons.map((item) => renderLessonButton(item, context)).join("")}
        </nav>
      </aside>

      <main class="content-area">
        <article class="lesson-panel">
          <header class="lesson-header">
            <div class="lesson-kicker">
              <span>Lesson ${lesson.number}</span>
              ${context.completedLessons.has(lesson.id) ? '<span class="done-pill">已完成</span>' : '<span>未完成</span>'}
            </div>
            <h2>${escapeHtml(lesson.title)}</h2>
            <p>${escapeHtml(lesson.summary)}</p>
          </header>

          <div class="tab-list" role="tablist" aria-label="课程内容">
            <button class="tab-button ${context.activeTab === "explain" ? "is-active" : ""}" type="button" role="tab" aria-selected="${context.activeTab === "explain"}" data-tab="explain">讲解</button>
            <button class="tab-button ${context.activeTab === "review" ? "is-active" : ""}" type="button" role="tab" aria-selected="${context.activeTab === "review"}" data-tab="review">复盘</button>
          </div>

          <section class="tab-panel">
            ${context.activeTab === "explain" ? renderExplainTab(lesson) : renderReviewTab(lesson, context)}
          </section>
        </article>
      </main>
    </div>
  `;
}

function renderLessonButton(lesson: Lesson, context: RenderContext): string {
  const isActive = lesson.id === context.activeLessonId;
  const isComplete = context.completedLessons.has(lesson.id);

  return `
    <button
      type="button"
      class="course-item ${isActive ? "is-active" : ""}"
      data-lesson-id="${lesson.id}"
      data-nav-id="${lesson.id}"
      aria-current="${isActive ? "page" : "false"}"
    >
      <span class="course-number">${lesson.number}</span>
      <span class="course-meta">
        <strong>${escapeHtml(lesson.title)}</strong>
      </span>
      <span class="course-state ${isComplete ? "is-complete" : ""}">${isComplete ? "已完成" : "未完成"}</span>
    </button>
  `;
}

function renderExplainTab(lesson: Lesson): string {
  return `
    <div class="section-stack">
      ${lesson.sections
        .map(
          (section) => `
            <section class="content-section">
              <h3>${escapeHtml(section.heading)}</h3>
              ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </section>
          `,
        )
        .join("")}
    </div>

    <div class="feature-grid">
      ${lesson.featureCards
        .map(
          (card) => `
            <div class="feature-card">
              <h4>${escapeHtml(card.title)}</h4>
              <p>${escapeHtml(card.text)}</p>
            </div>
          `,
        )
        .join("")}
    </div>

    <div class="code-stack">
      ${lesson.examples.map((example) => renderCodeExample(example)).join("")}
    </div>
  `;
}

function renderReviewTab(lesson: Lesson, context: RenderContext): string {
  const isComplete = context.completedLessons.has(lesson.id);

  return `
    <div class="review-list">
      ${lesson.review
        .map(
          (item, index) => `
            <details class="review-item" ${index === 0 ? "open" : ""}>
              <summary>
                <span>${index + 1}</span>
                ${escapeHtml(item.question)}
              </summary>
              <p>${escapeHtml(item.answer)}</p>
            </details>
          `,
        )
        .join("")}
    </div>

    <div class="complete-actions">
      <button class="complete-button ${isComplete ? "is-complete" : ""}" type="button" data-complete-button ${isComplete ? "disabled" : ""}>
        ${isComplete ? "已完成" : "标记完成"}
      </button>
    </div>
  `;
}

function renderCodeExample(example: CodeExample): string {
  return `
    <figure class="code-card">
      <figcaption>
        <span>${escapeHtml(example.title)}</span>
        <code>${escapeHtml(example.language)}</code>
      </figcaption>
      <pre><code>${highlightCode(example.code, example.highlightLines ?? [])}</code></pre>
    </figure>
  `;
}

function getActiveLesson(context: RenderContext): Lesson {
  return context.lessons.find((lesson) => lesson.id === context.activeLessonId) ?? context.lessons[0];
}

function withBase(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
