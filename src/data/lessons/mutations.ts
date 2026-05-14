import type { Lesson } from "../../types";

export const mutations: Lesson = {
  id: "mutations",
  number: "05",
  title: "Mutation 与输入对象",
  summary: "用 Mutation 表达写操作，用 input 类型组织复杂参数。",
  sections: [
    {
      heading: "Mutation 表达写操作",
      body: [
        "Query 用于读取，Mutation 用于创建、更新、删除等会改变系统状态的操作。GraphQL 不强制数据库事务，但命名上应该让副作用清晰可见。",
        "复杂参数建议使用 input 类型，避免一个字段挂很多散落参数，也便于后续扩展。",
      ],
    },
    {
      heading: "响应要服务于界面刷新",
      body: [
        "Mutation 不只返回成功或失败。它应该返回客户端接下来需要更新界面的对象、状态或错误信息。",
      ],
    },
  ],
  featureCards: [
    { title: "Mutation Root", text: "写操作从 Mutation 根类型进入。" },
    { title: "Input Object", text: "专门用于参数输入的对象类型。" },
    { title: "Payload", text: "返回对象、错误和业务状态。" },
    { title: "Idempotency", text: "必要时设计客户端请求 ID，避免重复提交。" },
  ],
  examples: [
    {
      title: "创建项目的 Mutation",
      language: "graphql",
      highlightLines: [1, 6, 11],
      code: `input CreateProjectInput {
  name: String!
  tagline: String
}

type Mutation {
  createProject(input: CreateProjectInput!): CreateProjectPayload!
}

type CreateProjectPayload {
  project: Project
  errors: [String!]!
}`,
    },
  ],
  review: [
    {
      question: "Mutation 一定只能返回 Boolean 吗？",
      answer: "不。更实用的做法是返回 payload，包含被修改对象、错误信息和界面需要的状态。",
    },
    {
      question: "为什么复杂参数适合使用 input 类型？",
      answer: "input 类型能把参数组织成稳定结构，字段更清晰，也方便后续扩展。",
    },
    {
      question: "Mutation 和 Query 最核心的语义区别是什么？",
      answer: "Query 表达读取数据，Mutation 表达会改变系统状态的写操作，例如创建、更新或删除。",
    },
    {
      question: "Mutation 的响应为什么应服务于界面刷新？",
      answer: "写操作完成后，客户端通常需要更新页面状态，所以响应应返回被修改对象、业务状态或错误信息，而不只是成功布尔值。",
    },
  ],
};
