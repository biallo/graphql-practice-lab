import { lessons } from "./data/lessons";
import type { Tab } from "./types";
import { renderAppView } from "./ui/render";

const selectedLessonKey = "graphql-lab:selected-lesson";
const completedLessonsKey = "graphql-lab:completed-lessons";

type ScrollReason = "initial" | "selection";
type RenderOptions = {
  resetContentScroll?: boolean;
};

export function createApp(app: HTMLElement): void {
  let activeLessonId = getInitialLessonId();
  let activeTab: Tab = "explain";
  const completedLessons = readCompletedLessons();

  renderApp("initial");

  window.addEventListener("hashchange", () => {
    const lessonId = normalizeLessonId(location.hash.replace("#", ""));
    if (!lessonId || lessonId === activeLessonId) return;

    activeLessonId = lessonId;
    activeTab = "explain";
    persistSelectedLesson(lessonId);
    renderApp("initial", { resetContentScroll: true });
  });

  function getInitialLessonId(): string {
    const hashLesson = normalizeLessonId(location.hash.replace("#", ""));
    if (hashLesson) return hashLesson;

    const storedLesson = normalizeLessonId(localStorage.getItem(selectedLessonKey) ?? "");
    if (storedLesson) return storedLesson;

    return lessons[0].id;
  }

  function renderApp(scrollReason: ScrollReason, options: RenderOptions = {}): void {
    const completeCount = lessons.filter((lesson) => completedLessons.has(lesson.id)).length;
    const completePercent = Math.round((completeCount / lessons.length) * 100);

    app.innerHTML = renderAppView({
      lessons,
      activeLessonId,
      activeTab,
      completedLessons,
      completeCount,
      completePercent,
    });

    bindEvents();
    if (options.resetContentScroll) {
      resetContentScroll();
    }
    scrollActiveCourseIntoView(scrollReason, activeLessonId);
  }

  function bindEvents(): void {
    document.querySelectorAll<HTMLButtonElement>("[data-lesson-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const lessonId = button.dataset.lessonId;
        if (!lessonId || lessonId === activeLessonId) return;
        selectLesson(lessonId, "selection");
      });
    });

    document.querySelector<HTMLSelectElement>("[data-lesson-select]")?.addEventListener("change", (event) => {
      const target = event.currentTarget as HTMLSelectElement;
      selectLesson(target.value, "selection");
    });

    document.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tab as Tab | undefined;
        if (!tab || tab === activeTab) return;

        activeTab = tab;
        renderApp("selection");
      });
    });

    document.querySelector<HTMLButtonElement>("[data-complete-button]")?.addEventListener("click", () => {
      completedLessons.add(activeLessonId);
      persistCompletedLessons(completedLessons);
      renderApp("selection");
    });
  }

  function selectLesson(lessonId: string, scrollReason: ScrollReason): void {
    const normalizedLessonId = normalizeLessonId(lessonId);
    if (!normalizedLessonId) return;

    activeLessonId = normalizedLessonId;
    activeTab = "explain";
    persistSelectedLesson(normalizedLessonId);
    renderApp(scrollReason, { resetContentScroll: true });
  }
}

function normalizeLessonId(value: string): string | null {
  return lessons.some((lesson) => lesson.id === value) ? value : null;
}

function readCompletedLessons(): Set<string> {
  try {
    const value = JSON.parse(localStorage.getItem(completedLessonsKey) ?? "[]");
    return new Set(Array.isArray(value) ? value.filter((item) => typeof item === "string") : []);
  } catch {
    return new Set();
  }
}

function persistSelectedLesson(lessonId: string): void {
  localStorage.setItem(selectedLessonKey, lessonId);
  history.replaceState(null, "", `${location.pathname}${location.search}#${lessonId}`);
}

function persistCompletedLessons(completedLessons: Set<string>): void {
  localStorage.setItem(completedLessonsKey, JSON.stringify([...completedLessons]));
}

function scrollActiveCourseIntoView(reason: ScrollReason, activeLessonId: string): void {
  requestAnimationFrame(() => {
    const list = document.querySelector<HTMLElement>(".course-list");
    const activeItem = document.querySelector<HTMLElement>(`[data-nav-id="${activeLessonId}"]`);
    if (!list || !activeItem) return;

    const listRect = list.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const isFullyVisible = itemRect.top >= listRect.top && itemRect.bottom <= listRect.bottom;

    if (reason === "initial" || !isFullyVisible) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  });
}

function resetContentScroll(): void {
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>(".content-area")?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  });
}
