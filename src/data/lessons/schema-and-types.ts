import type { Lesson } from "../../types";

export const schemaAndTypes: Lesson = {
  id: "schema-and-types",
  number: "02",
  title: "Schema 与类型系统",
  summary: "用类型、字段和非空标记描述 API 能力，建立可验证的数据契约。",
  sections: [
    {
      heading: "Schema 是 API 地图",
      body: [
        "Schema 使用类型系统描述客户端可以查询的入口、字段、参数和返回值。客户端不能随意请求 Schema 中不存在的字段。",
        "GraphQL SDL 是常见的 Schema 描述语法，适合先设计 API 形状，再让 resolver 填入数据。",
      ],
    },
    {
      heading: "类型让工具能参与开发",
      body: [
        "类型越清晰，IDE 补全、查询校验、文档生成和前后端类型生成就越可靠。",
        "非空标记 ! 是承诺：如果字段返回 null，GraphQL 会把错误传播到上层可空字段。这个规则需要谨慎使用。",
      ],
    },
  ],
  featureCards: [
    { title: "Object Type", text: "描述业务对象，例如 User、Project、Issue。" },
    { title: "Root Query", text: "定义读取数据的入口字段。" },
    { title: "Scalar", text: "基础值类型，例如 String、ID、Boolean、Int。" },
    { title: "List / Non-null", text: "组合列表和非空，表达返回值约束。" },
  ],
  examples: [
    {
      title: "一份最小 Schema",
      language: "graphql",
      highlightLines: [1, 7, 8],
      code: `type Query {
  project(name: String!): Project
}

type Project {
  id: ID!
  name: String!
  contributors(first: Int = 10): [User!]!
}

type User {
  id: ID!
  name: String!
}`,
    },
  ],
  review: [
    {
      question: "Schema 的主要职责是什么？",
      answer: "描述 API 可以被查询的类型、字段、参数和返回值，形成客户端与服务端之间的契约。",
    },
    {
      question: "[User!]! 和 [User] 有什么区别？",
      answer: "[User!]! 表示列表本身不能为 null，列表里的每个 User 也不能为 null；[User] 则列表和元素都可能为 null。",
    },
  ],
};
