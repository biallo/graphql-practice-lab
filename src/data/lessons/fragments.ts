import type { Lesson } from "../../types";

export const fragments: Lesson = {
  id: "fragments",
  number: "06",
  title: "Fragment 与组件数据",
  summary: "用 Fragment 复用字段选择，并把组件数据需求放在离组件更近的位置。",
  sections: [
    {
      heading: "Fragment 复用字段集合",
      body: [
        "Fragment 是可复用的 selection set。多个查询或同一个查询的多个位置需要相同字段时，可以用 fragment 保持一致。",
        "在前端组件中，fragment 常用于声明组件自己的数据需求，页面查询再组合这些 fragment。",
      ],
    },
    {
      heading: "避免隐藏过多字段",
      body: [
        "Fragment 很方便，但不要把字段藏得太深。命名要贴近组件或业务含义，让阅读查询的人知道为什么需要这些字段。",
      ],
    },
  ],
  featureCards: [
    { title: "Named Fragment", text: "给字段集合命名，便于复用。" },
    { title: "Type Condition", text: "声明 fragment 适用于哪个 GraphQL 类型。" },
    { title: "Colocation", text: "组件声明自己的数据需求。" },
    { title: "Consistency", text: "同一展示逻辑共享同一字段集合。" },
  ],
  examples: [
    {
      title: "组件级 Fragment",
      language: "graphql",
      highlightLines: [1, 8],
      code: `fragment ProjectCard_project on Project {
  name
  tagline
  repository {
    url
  }
}

query ProjectList {
  projects {
    id
    ...ProjectCard_project
  }
}`,
    },
  ],
  review: [
    {
      question: "Fragment 的核心价值是什么？",
      answer: "复用字段集合，并让同一组件或展示逻辑的数据需求保持一致。",
    },
    {
      question: "Fragment 使用过多有什么风险？",
      answer: "查询可读性会下降，字段来源不直观，所以要用清晰命名并控制层级。",
    },
    {
      question: "Type Condition 在 Fragment 中有什么作用？",
      answer: "它声明这个 fragment 适用于哪个 GraphQL 类型，只有该类型上存在的字段才能写进 fragment。",
    },
  ],
};
