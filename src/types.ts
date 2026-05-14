export type Tab = "explain" | "review";

export type CodeExample = {
  title: string;
  language: string;
  code: string;
  highlightLines?: number[];
};

export type Lesson = {
  id: string;
  number: string;
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    body: string[];
  }>;
  featureCards: Array<{
    title: string;
    text: string;
  }>;
  examples: CodeExample[];
  review: Array<{
    question: string;
    answer: string;
  }>;
};
