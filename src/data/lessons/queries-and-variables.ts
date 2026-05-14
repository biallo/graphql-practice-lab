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
  ],
  featureCards: [
    { title: "Operation Name", text: "给查询命名，方便监控和排查。" },
    { title: "Variables", text: "把动态参数放到 JSON 变量中传递。" },
    { title: "Arguments", text: "字段级参数可以控制过滤、分页和排序。" },
    { title: "Selection Set", text: "花括号里的字段集合决定响应形状。" },
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
  ],
};
