import type { Lesson } from "../../types";

export const productionChecklist: Lesson = {
  id: "production-checklist",
  number: "22",
  title: "生产发布清单",
  summary: "用上线清单把安全、性能、权限、监控、缓存和 Schema 演进串起来。",
  sections: [
    {
      heading: "上线前要检查的不只是功能",
      body: [
        "GraphQL API 能跑通只是第一步。生产发布前还要确认权限、复杂度限制、分页上限、错误形状、日志监控、Schema 兼容性和缓存策略。",
        "这些横切问题如果上线后再补，往往会变成安全事故、性能事故或 breaking change。",
      ],
    },
    {
      heading: "把清单放进工程流程",
      body: [
        "上线清单不应该只存在脑子里。它应该进入 PR 模板、CI 检查、Schema check、测试用例和监控面板。",
        "成熟团队会让关键风险自动化检查，人工 review 只处理设计判断和例外情况。",
      ],
    },
    {
      heading: "发布后继续观察",
      body: [
        "发布不是结束。新字段上线后要观察 operation 错误率、慢字段、查询复杂度、N+1、业务错误和客户端使用量。",
        "如果新增字段没有被使用，或者某个 operation 成本异常，应及时回看 Schema 设计和客户端查询方式。",
      ],
    },
  ],
  featureCards: [
    { title: "Security", text: "鉴权、字段权限、租户隔离、输入校验和 introspection 策略。" },
    { title: "Performance", text: "分页上限、DataLoader、复杂度限制、慢字段监控。" },
    { title: "Reliability", text: "错误 code、部分响应、超时、重试和降级策略。" },
    { title: "Evolution", text: "Schema check、deprecated 生命周期和客户端操作追踪。" },
  ],
  examples: [
    {
      title: "发布清单",
      language: "ts",
      highlightLines: [2, 6, 10, 14],
      code: `const productionChecklist = [
  "All list fields have max page size",
  "Resolvers enforce object and tenant permissions",
  "Mutations return typed payloads with userErrors",
  "Operation tests cover success, auth and error cases",
  "DataLoader or batching is used for nested reads",
  "Depth and complexity limits are enabled",
  "Slow field and error metrics are visible",
  "Schema check passes against known operations",
  "Deprecated fields include migration guidance",
  "File uploads use signed URLs or a dedicated endpoint",
];`,
    },
    {
      title: "PR 检查问题",
      language: "graphql",
      highlightLines: [1, 4, 7],
      code: `# Does this add a new list field?
# If yes, where are first/after and max page size handled?

# Does this expose user or tenant-scoped data?
# If yes, which resolver or data layer enforces permission?

# Does this change an existing field?
# If yes, is it additive, deprecated, or breaking?`,
    },
  ],
  review: [
    {
      question: "为什么生产发布清单很重要？",
      answer: "GraphQL 的风险通常来自横切问题，清单能在上线前系统检查安全、性能、错误和演进风险。",
    },
    {
      question: "哪些检查适合自动化？",
      answer: "Schema check、operation 校验、测试、lint、复杂度规则、分页参数限制和基础权限测试都适合自动化。",
    },
    {
      question: "发布后应该观察哪些指标？",
      answer: "operation 错误率、字段耗时、复杂度、慢查询、N+1、业务错误和客户端使用量。",
    },
    {
      question: "为什么 PR 模板适合承载发布清单？",
      answer: "因为 API 设计风险通常在代码 review 阶段就能发现，把问题前置能减少上线后补救成本。",
    },
  ],
};
