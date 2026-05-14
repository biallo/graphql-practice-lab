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
    {
      heading: "性能问题仍然需要设计",
      body: [
        "GraphQL 减少了过度获取，但不会自动消除性能问题。嵌套字段可能触发 N+1 查询，深层查询可能让一次请求消耗过高，开放 API 还需要控制查询复杂度。",
        "常见治理方式包括 DataLoader 批量加载和缓存、限制查询深度、设置复杂度预算，以及给耗时字段做分页或异步化设计。",
      ],
    },
  ],
  featureCards: [
    { title: "parent", text: "上一级字段返回的对象。" },
    { title: "args", text: "当前字段收到的参数。" },
    { title: "context", text: "请求级共享对象，例如用户、权限和数据源。" },
    { title: "info", text: "当前查询的执行信息，高级场景会用到。" },
    { title: "DataLoader", text: "批量合并同类读取，减少嵌套 resolver 带来的 N+1 查询。" },
    { title: "Query Limits", text: "用深度、复杂度和分页限制控制一次请求的执行成本。" },
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
    {
      question: "parent 参数通常代表什么？",
      answer: "parent 是上一级字段 resolver 返回的对象，当前字段可以基于它继续读取或计算数据。",
    },
    {
      question: "没有自定义 resolver 时，服务端通常会怎么处理字段？",
      answer: "多数 GraphQL 服务端框架会尝试从父对象上读取同名属性，适合简单字段；复杂字段再补自定义 resolver。",
    },
    {
      question: "resolver 为什么也是做鉴权的常见位置？",
      answer: "因为 resolver 执行时能拿到当前字段、参数和 context 中的用户信息，可以在取数前判断当前请求是否有权限。",
    },
    {
      question: "GraphQL 为什么仍然可能出现 N+1 查询？",
      answer: "因为嵌套字段可能让每个父对象都单独触发一次子字段读取，需要用批量加载、缓存或查询规划来合并这些读取。",
    },
    {
      question: "开放 GraphQL API 时为什么要限制查询深度或复杂度？",
      answer: "客户端可以自由组合嵌套字段，如果不限制，一次请求可能触发过高计算或数据库压力，影响服务稳定性。",
    },
  ],
};
