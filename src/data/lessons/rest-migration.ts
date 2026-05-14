import type { Lesson } from "../../types";

export const restMigration: Lesson = {
  id: "rest-migration",
  number: "21",
  title: "GraphQL 与 REST 共存迁移",
  summary: "把 GraphQL 作为渐进式聚合层，引入到已有 REST 或微服务系统中。",
  sections: [
    {
      heading: "迁移不需要推倒重来",
      body: [
        "很多团队不是从零开始，而是已有 REST、RPC 或微服务。GraphQL 可以先作为 BFF 聚合层，把多个后端接口组合成面向页面的数据图。",
        "这能降低前端多次请求和数据拼装复杂度，同时避免一次性重写所有后端服务。",
      ],
    },
    {
      heading: "先选高价值页面",
      body: [
        "优先选择需要聚合多个接口、前端拼装复杂、移动端网络成本高或多端复用明显的页面。",
        "不要从最底层、最通用、最复杂的后端域开始。先做一个能体现价值且风险可控的垂直切片。",
      ],
    },
    {
      heading: "迁移期间要防止双重真相",
      body: [
        "GraphQL 和 REST 共存时，字段含义、权限规则和错误语义必须保持一致，否则客户端会困惑，也会增加排查成本。",
        "可以把公共业务逻辑下沉到服务层，GraphQL 和 REST 都调用同一套能力，避免复制规则。",
      ],
    },
  ],
  featureCards: [
    { title: "BFF Layer", text: "GraphQL 作为前端友好的聚合层，底层继续调用 REST 或服务。" },
    { title: "Vertical Slice", text: "从一个页面或业务流程开始迁移，而不是一次性全量替换。" },
    { title: "Shared Domain Logic", text: "权限和业务规则下沉复用，避免 REST 与 GraphQL 语义分裂。" },
    { title: "Compatibility", text: "迁移期保持旧接口可用，逐步把客户端切到 GraphQL。" },
  ],
  examples: [
    {
      title: "GraphQL resolver 聚合 REST",
      language: "ts",
      highlightLines: [4, 6, 11],
      code: `const resolvers = {
  Query: {
    taskDetail: async (_parent, args, context) => {
      const task = await context.rest.tasks.get(args.id);
      const comments = await context.rest.comments.listByTask(args.id);
      const permissions = await context.rest.permissions.forTask(args.id);

      return {
        ...task,
        comments,
        viewerPermissions: permissions,
      };
    },
  },
};`,
    },
  ],
  review: [
    {
      question: "GraphQL 迁移为什么适合从 BFF 聚合层开始？",
      answer: "它能先改善前端数据获取体验，同时复用已有 REST 或微服务，降低重写风险。",
    },
    {
      question: "如何选择第一个迁移场景？",
      answer: "选择接口聚合复杂、前端收益明显、边界清晰且风险可控的页面或业务流程。",
    },
    {
      question: "迁移期间双重真相有什么风险？",
      answer: "REST 和 GraphQL 如果权限、字段含义或错误语义不一致，会导致客户端行为混乱和问题难以排查。",
    },
    {
      question: "如何减少 REST 与 GraphQL 规则重复？",
      answer: "把公共业务逻辑、权限和数据访问封装到服务层，让两种 API 都调用同一套能力。",
    },
  ],
};
