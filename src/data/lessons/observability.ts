import type { Lesson } from "../../types";

export const observability: Lesson = {
  id: "observability",
  number: "19",
  title: "监控、日志与可观测性",
  summary: "用 operation name、字段耗时、错误率和复杂度指标定位 GraphQL 线上问题。",
  sections: [
    {
      heading: "GraphQL 需要 operation 级监控",
      body: [
        "GraphQL 通常只有一个 HTTP endpoint，传统按 URL 聚合的监控不够用。你需要按 operation name、客户端名称、用户类型和复杂度来观察请求。",
        "没有 operation name 的请求很难定位来源，因此生产客户端应该给每个操作命名。",
      ],
    },
    {
      heading: "字段级耗时能定位瓶颈",
      body: [
        "一次 GraphQL 请求可能执行很多 resolver。总耗时只能说明请求慢，字段级耗时才能告诉你慢在哪里。",
        "结合 resolver path、SQL 日志和 DataLoader 批量情况，可以更快定位 N+1、慢查询或外部服务延迟。",
      ],
    },
    {
      heading: "错误指标要分层",
      body: [
        "解析/校验错误、鉴权错误、业务错误、resolver 执行错误应该分开统计。混在一起只看总错误率，会让告警失去判断力。",
        "业务错误可能是用户正常操作结果，不一定代表系统故障；执行错误和慢查询更需要告警。",
      ],
    },
  ],
  featureCards: [
    { title: "Operation Name", text: "生产请求必须命名，方便追踪和聚合。" },
    { title: "Field Timing", text: "记录 resolver path 和耗时，定位慢字段。" },
    { title: "Complexity Metrics", text: "记录查询深度、复杂度、列表参数和返回大小。" },
    { title: "Error Classes", text: "分开统计校验、鉴权、业务和执行错误。" },
  ],
  examples: [
    {
      title: "请求日志字段",
      language: "json",
      highlightLines: [3, 6, 8],
      code: `{
  "requestId": "req_123",
  "operationName": "TaskDetail",
  "clientName": "web",
  "durationMs": 184,
  "complexity": 72,
  "errors": 0,
  "slowFields": [
    { "path": "task.comments.nodes.author", "durationMs": 92 }
  ]
}`,
    },
    {
      title: "resolver 计时包装",
      language: "ts",
      highlightLines: [3, 7],
      code: `async function measureResolver(path, resolver) {
  const start = performance.now();
  try {
    return await resolver();
  } finally {
    const durationMs = performance.now() - start;
    metrics.recordFieldTiming(path, durationMs);
  }
}`,
    },
  ],
  review: [
    {
      question: "为什么 GraphQL 不能只按 URL 监控？",
      answer: "因为很多操作共用同一个 endpoint，必须按 operation name 和字段路径才能区分具体请求和瓶颈。",
    },
    {
      question: "字段级耗时有什么价值？",
      answer: "它能定位具体慢 resolver，帮助发现 N+1、慢 SQL 或外部服务延迟。",
    },
    {
      question: "为什么错误指标要分层？",
      answer: "不同错误含义不同，业务错误不一定是系统故障，执行错误和慢查询更需要告警。",
    },
    {
      question: "复杂度指标应该记录哪些信息？",
      answer: "查询深度、复杂度分数、列表参数、返回大小、operation name 和客户端来源。",
    },
  ],
};
