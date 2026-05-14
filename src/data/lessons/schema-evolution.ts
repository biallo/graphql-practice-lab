import type { Lesson } from "../../types";

export const schemaEvolution: Lesson = {
  id: "schema-evolution",
  number: "15",
  title: "Schema 演进与版本管理",
  summary: "用新增字段、弃用字段和兼容性检查，让 GraphQL API 稳定演进。",
  sections: [
    {
      heading: "GraphQL 通常避免 URL 版本号",
      body: [
        "GraphQL 更推荐在同一个 Schema 中渐进演进：新增字段不会破坏旧查询，旧字段可以标记 deprecated 并逐步迁移。",
        "这不代表 GraphQL 没有 breaking change。删除字段、修改字段类型、收紧 nullability、修改参数要求都可能破坏客户端。",
      ],
    },
    {
      heading: "弃用字段要给迁移路径",
      body: [
        "deprecated 不只是一个标记，还应该说明替代字段和迁移原因。没有替代方案的弃用，很难推动客户端迁移。",
        "在删除字段前，最好通过查询日志确认没有活跃客户端继续使用。",
      ],
    },
    {
      heading: "Schema Registry 与兼容性检查",
      body: [
        "团队规模变大后，可以用 Schema registry 收集 Schema 版本、客户端操作和兼容性检查结果。",
        "CI 中做 Schema diff，可以在合并前发现 breaking change，避免生产客户端突然失败。",
      ],
    },
    {
      heading: "enum 演进有额外风险",
      body: [
        "给 enum 新增值在 Schema 层通常是兼容的，但旧客户端如果没有 default 分支，UI 可能无法识别新值。",
        "对外部客户端或移动端，要把新增 enum 值当作需要沟通的变更，并确保客户端有兜底展示。",
      ],
    },
    {
      heading: "字段删除要有生命周期",
      body: [
        "一个字段从弃用到删除，通常要经历：新增替代字段、标记 deprecated、监控使用量、通知调用方、等待迁移窗口、最后删除。",
        "没有操作日志时，不要轻易删除字段。你无法确认是否仍有客户端依赖它。",
      ],
    },
  ],
  featureCards: [
    { title: "Additive Change", text: "新增字段、类型或可选参数通常是兼容变更。" },
    { title: "Breaking Change", text: "删除字段、改返回类型、增加必填参数都可能破坏客户端。" },
    { title: "@deprecated", text: "标记旧字段并提供替代字段和迁移说明。" },
    { title: "Schema Check", text: "在 CI 中检查 Schema diff 和客户端操作兼容性。" },
    { title: "Enum Fallback", text: "客户端应对未知 enum 值有默认展示，避免新增值导致崩溃。" },
    { title: "Usage Tracking", text: "删除字段前先看真实操作日志，确认没有活跃使用。" },
  ],
  examples: [
    {
      title: "弃用字段",
      language: "graphql",
      highlightLines: [4, 5],
      code: `type Project {
  id: ID!
  name: String!
  ownerName: String @deprecated(reason: "Use owner { name } instead.")
  owner: User!
}`,
    },
    {
      title: "客户端处理未知 enum",
      language: "ts",
      highlightLines: [7, 8],
      code: `function taskStatusLabel(status: string) {
  switch (status) {
    case "TODO":
      return "待处理";
    case "DONE":
      return "已完成";
    default:
      return "未知状态";
  }
}`,
    },
  ],
  review: [
    {
      question: "为什么 GraphQL 常用渐进演进而不是 URL 版本号？",
      answer: "因为客户端只请求自己需要的字段，新增字段通常不影响旧查询，可以在同一个 Schema 中逐步演进。",
    },
    {
      question: "哪些 Schema 变更常见地属于 breaking change？",
      answer: "删除字段、修改字段类型、收紧可空性、增加必填参数、删除 enum 值等都可能破坏客户端。",
    },
    {
      question: "@deprecated 应该包含什么信息？",
      answer: "应该说明为什么弃用，以及客户端应该迁移到哪个替代字段或模式。",
    },
    {
      question: "Schema check 在 CI 中有什么价值？",
      answer: "它能在合并前发现破坏性变更，结合客户端操作记录判断是否会影响线上客户端。",
    },
    {
      question: "为什么新增 enum 值也可能影响旧客户端？",
      answer: "旧客户端可能没有处理新值的分支，如果没有默认展示，可能出现空白、错误文案或运行时异常。",
    },
    {
      question: "删除 deprecated 字段前应该确认什么？",
      answer: "应该确认已有替代字段、调用方已迁移、操作日志中没有活跃使用，并经过足够迁移窗口。",
    },
  ],
};
