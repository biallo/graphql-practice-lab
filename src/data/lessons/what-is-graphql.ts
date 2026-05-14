import type { Lesson } from "../../types";

export const whatIsGraphql: Lesson = {
  id: "what-is-graphql",
  number: "01",
  title: "什么是 GraphQL",
  summary: "理解 GraphQL 解决的问题、核心概念，以及它和传统 REST API 的区别。",
  sections: [
    {
      heading: "GraphQL 的定义",
      body: [
        "GraphQL 是面向 API 的查询语言，也是一套服务端执行模型。客户端发送一个结构化查询，服务端按 Schema 校验请求，然后只返回查询中声明的字段。",
        "它不绑定数据库。GraphQL 服务可以从数据库、REST 服务、第三方 API 或内存数据中取数，关键是把这些数据组织成一个类型明确的 API 面。",
      ],
    },
    {
      heading: "它解决了什么问题",
      body: [
        "传统接口通常按资源或页面提前设计 URL。页面变化后，客户端可能需要多次请求，或者拿到大量当前视图用不到的字段。",
        "GraphQL 把选择权交给客户端：一次请求里描述需要的字段和嵌套关系，响应结构会贴近查询结构，过度获取和获取不足的问题都会更少。",
      ],
    },
    {
      heading: "学习时先抓住三件事",
      body: [
        "Schema 定义服务端能提供什么，Query 描述客户端要什么，Resolver 负责把字段解析成真实数据。后面的课程会围绕这三件事逐步展开。",
        "把 GraphQL 想成一份可执行的数据契约会更准确：它既约束请求，也约束响应，还能让工具自动补全、校验和生成类型。",
      ],
    },
  ],
  featureCards: [
    {
      title: "强类型 Schema",
      text: "API 能力由类型和字段组成，客户端在请求前就能被校验。",
    },
    {
      title: "客户端指定响应",
      text: "查询里写了哪些字段，响应里通常就返回哪些字段。",
    },
    {
      title: "单一入口",
      text: "常见实现会使用一个 GraphQL endpoint，再通过查询表达不同数据需求。",
    },
    {
      title: "渐进演进",
      text: "新增字段通常不会影响旧查询，过期字段可用 deprecated 标记逐步迁移。",
    },
  ],
  examples: [
    {
      title: "客户端请求需要的数据",
      language: "graphql",
      highlightLines: [2, 4, 5, 8],
      code: `query GetProject($name: String!) {
  project(name: $name) {
    # 只声明当前页面真正需要的字段
    name
    tagline
    repository {
      # 可以沿着关系继续选择嵌套字段
      url
    }
  }
}`,
    },
    {
      title: "服务端返回同形状数据",
      language: "json",
      highlightLines: [4, 5, 7],
      code: `{
  "data": {
    "project": {
      "name": "GraphQL",
      "tagline": "A query language for APIs",
      "repository": {
        "url": "https://github.com/graphql/graphql-spec"
      }
    }
  }
}`,
    },
  ],
  review: [
    {
      question: "GraphQL 是数据库吗？",
      answer: "不是。GraphQL 是 API 查询语言和运行时模型，它可以连接任何数据源，包括数据库、REST 服务和第三方系统。",
    },
    {
      question: "GraphQL 为什么能减少过度获取？",
      answer: "因为客户端在查询中精确声明字段，服务端按声明返回数据，不需要把固定接口的完整资源全部传回来。",
    },
    {
      question: "第一课最重要的三个概念是什么？",
      answer: "Schema 定义能力，Query 表达需求，Resolver 把字段解析为真实数据。",
    },
  ],
};
