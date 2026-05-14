import type { Lesson } from "../../types";

export const resolvers: Lesson = {
  id: "resolvers",
  number: "04",
  title: "Resolver 入门",
  summary: "理解字段解析函数如何把 Schema 连接到真实数据源。",
  sections: [
    {
      heading: "Resolver 是字段的执行逻辑",
      body: [
        "Schema 只说明字段存在和返回类型，resolver 决定字段的数据从哪里来、如何计算、如何鉴权。",
        "每个字段都可以有 resolver。没有自定义 resolver 时，多数服务端框架会尝试从父对象上读取同名属性。",
      ],
    },
    {
      heading: "四个常见参数",
      body: [
        "resolver 常见参数包括 parent、args、context、info。初学阶段先掌握 parent 和 args，再把 context 用于登录用户、数据库连接和 DataLoader。",
      ],
    },
  ],
  featureCards: [
    { title: "parent", text: "上一级字段返回的对象。" },
    { title: "args", text: "当前字段收到的参数。" },
    { title: "context", text: "请求级共享对象，例如用户、权限和数据源。" },
    { title: "info", text: "当前查询的执行信息，高级场景会用到。" },
  ],
  examples: [
    {
      title: "JavaScript resolver 示例",
      language: "ts",
      highlightLines: [4, 8, 12],
      code: `const resolvers = {
  Query: {
    project: async (_parent, args, context) => {
      // args.name 来自 query 中的字段参数
      return context.db.project.findByName(args.name);
    },
  },
  Project: {
    contributors: async (project, args, context) => {
      // project 是上一级 resolver 返回的对象
      return context.db.user.findContributors(project.id, args.first);
    },
  },
};`,
    },
  ],
  review: [
    {
      question: "Schema 和 resolver 的边界是什么？",
      answer: "Schema 定义 API 形状和类型约束，resolver 实现字段如何取数或计算。",
    },
    {
      question: "context 适合放什么？",
      answer: "适合放请求级共享资源，例如当前用户、权限信息、数据库客户端、缓存和 DataLoader。",
    },
  ],
};
