import type { Lesson } from "../../types";

export const queryComplexitySecurity: Lesson = {
  id: "query-complexity-security",
  number: "12",
  title: "查询复杂度与安全",
  summary: "用深度限制、复杂度预算、persisted queries 和限流保护 GraphQL API。",
  sections: [
    {
      heading: "GraphQL 的自由度需要边界",
      body: [
        "GraphQL 允许客户端自由组合字段，这也是它强大的原因。但开放 API 如果没有边界，一次请求就可能构造出非常深或非常昂贵的查询。",
        "安全设计的目标不是限制所有复杂查询，而是让复杂度可预期、可监控、可拒绝。",
      ],
    },
    {
      heading: "深度与复杂度",
      body: [
        "深度限制控制嵌套层级，复杂度限制给字段设置成本，并把整个查询的成本累加起来。",
        "复杂度比深度更精确，因为一个浅层查询也可能请求巨大列表；一个深层查询如果字段都很轻，成本也可能可接受。",
      ],
    },
    {
      heading: "Persisted Queries",
      body: [
        "Persisted queries 把允许执行的查询提前注册，客户端只发送查询 ID 或 hash。服务端可以拒绝未知查询。",
        "它常用于生产环境降低传输体积、减少任意查询风险，并让查询变更进入审核流程。",
      ],
    },
    {
      heading: "限制列表参数",
      body: [
        "复杂度控制不能只看查询结构，还要限制列表参数。例如 first 最大只能是 50 或 100，避免客户端一次请求超大列表。",
        "服务端应该对分页参数做统一校验，而不是依赖前端传入合理值。",
      ],
    },
    {
      heading: "Introspection 的取舍",
      body: [
        "Introspection 对开发工具很重要，但公开生产环境可能暴露完整 Schema。是否关闭要看 API 是否公开、是否已有认证、是否使用 persisted queries。",
        "关闭 introspection 不能替代鉴权、复杂度限制和限流。它只是减少信息暴露，不是完整安全方案。",
      ],
    },
  ],
  featureCards: [
    { title: "Depth Limit", text: "限制最大嵌套层级，防止递归式深层查询。" },
    { title: "Complexity Budget", text: "按字段成本估算一次查询的执行开销。" },
    { title: "Persisted Queries", text: "只允许执行已登记的查询，降低任意查询风险。" },
    { title: "Rate Limit", text: "按用户、IP、token 或复杂度积分做限流。" },
    { title: "Max Page Size", text: "统一限制 first/last，避免一次请求读取超大列表。" },
    { title: "Introspection", text: "生产环境是否开放要权衡工具体验和 Schema 暴露风险。" },
  ],
  examples: [
    {
      title: "危险的深层查询",
      language: "graphql",
      highlightLines: [5, 8, 11],
      code: `query DeepProject {
  project(id: "p1") {
    issues(first: 50) {
      nodes {
        comments(first: 50) {
          nodes {
            author {
              repositories(first: 50) {
                nodes {
                  issues(first: 50) {
                    nodes {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`,
    },
    {
      title: "限制分页参数",
      language: "ts",
      highlightLines: [2, 5],
      code: `function normalizePageSize(first: number | undefined) {
  const defaultSize = 20;
  const maxSize = 100;

  return Math.min(first ?? defaultSize, maxSize);
}

const resolvers = {
  Query: {
    issues: (_parent, args, context) => {
      return context.db.issue.findMany({
        take: normalizePageSize(args.first),
      });
    },
  },
};`,
    },
  ],
  review: [
    {
      question: "为什么 GraphQL API 需要查询复杂度控制？",
      answer: "因为客户端可以自由组合字段，没有控制时一次请求可能触发非常高的计算、数据库或网络成本。",
    },
    {
      question: "深度限制和复杂度预算有什么区别？",
      answer: "深度限制看嵌套层级，复杂度预算按字段成本估算总开销，复杂度通常更精细。",
    },
    {
      question: "persisted queries 的价值是什么？",
      answer: "它让服务端只执行已登记查询，降低任意查询风险，也方便审核、缓存和监控。",
    },
    {
      question: "为什么限流最好考虑复杂度而不只是请求次数？",
      answer: "因为不同 GraphQL 请求成本差异很大，一次复杂查询可能比很多简单查询更昂贵。",
    },
    {
      question: "为什么要限制 first 或 last 的最大值？",
      answer: "因为列表参数直接影响返回规模和执行成本，不能依赖客户端自觉传入合理大小。",
    },
    {
      question: "关闭 introspection 是否就足够安全？",
      answer: "不够。它只能减少 Schema 暴露，仍然需要鉴权、复杂度限制、限流和输入校验。",
    },
  ],
};
