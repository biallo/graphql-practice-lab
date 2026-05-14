import type { Lesson } from "../../types";

export const queriesAndVariables: Lesson = {
  id: "queries-and-variables",
  number: "03",
  title: "Query 与变量",
  summary: "编写可复用的查询，用变量把动态输入和查询结构分离。",
  sections: [
    {
      heading: "Query 描述读取需求",
      body: [
        "Query 是读取数据的操作。建议给查询命名，这样日志、监控和调试工具都能识别是哪一个业务请求。",
        "字段可以接收参数，变量则让参数值从查询文本中抽离出来，避免拼接字符串。",
      ],
    },
    {
      heading: "响应会跟随查询形状",
      body: [
        "GraphQL 响应通常放在 data 字段下，并保持和查询相同的嵌套结构。这个特性让客户端更容易把结果映射到视图。",
      ],
    },
    {
      heading: "data 和 errors 可以同时出现",
      body: [
        "GraphQL 响应不是简单的成功或失败。部分字段解析失败时，服务端可能仍然返回已经成功解析的 data，同时在 errors 中说明失败位置和原因。",
        "这让客户端可以决定如何降级显示：例如主体内容正常展示，某个次要字段显示为空状态或错误提示。",
      ],
    },
  ],
  featureCards: [
    { title: "Operation Name", text: "给查询命名，方便监控和排查。" },
    { title: "Variables", text: "把动态参数放到 JSON 变量中传递。" },
    { title: "Arguments", text: "字段级参数可以控制过滤、分页和排序。" },
    { title: "Selection Set", text: "花括号里的字段集合决定响应形状。" },
    { title: "Partial Data", text: "响应可能同时包含部分 data 和 errors，客户端需要能处理降级状态。" },
  ],
  examples: [
    {
      title: "带变量的查询",
      language: "graphql",
      highlightLines: [1, 2, 6],
      code: `query GetViewerRepositories($first: Int!) {
  viewer {
    repositories(first: $first) {
      nodes {
        name
        isPrivate
      }
    }
  }
}`,
    },
    {
      title: "部分成功的响应",
      language: "json",
      highlightLines: [3, 6, 9],
      code: `{
  "data": {
    "viewer": {
      "name": "Ada",
      "repositories": null
    }
  },
  "errors": [
    {
      "message": "Repository service is temporarily unavailable",
      "path": ["viewer", "repositories"]
    }
  ]
}`,
    },
  ],
  review: [
    {
      question: "为什么推荐使用变量而不是拼接查询字符串？",
      answer: "变量能让查询结构保持稳定，参数单独传递，更容易复用、缓存、校验和避免注入类问题。",
    },
    {
      question: "Selection Set 决定了什么？",
      answer: "它决定客户端希望返回哪些字段，以及响应数据的大致嵌套形状。",
    },
    {
      question: "为什么建议给 Query 命名？",
      answer: "命名后的 Query 更容易在日志、监控、错误报告和调试工具中定位具体业务请求。",
    },
    {
      question: "字段参数和变量的关系是什么？",
      answer: "字段参数定义当前字段需要的输入，变量负责在执行查询时传入动态值，让查询文本保持稳定。",
    },
    {
      question: "GraphQL 响应中的 data 和 errors 为什么可能同时存在？",
      answer: "因为字段是逐层解析的，某些字段失败时，其他已成功解析的字段仍可返回，失败信息会放进 errors。",
    },
  ],
};
