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
    {
      heading: "Schema 是产品级 API 合同",
      body: [
        "Schema 不只是技术描述，它决定前端能如何组织页面、权限边界如何表达、字段如何演进，以及团队之间如何协作。",
        "设计 Schema 时要优先表达业务语言，而不是照搬数据库表结构。一个好的 Schema 应该让调用方读起来像在描述业务对象和业务动作。",
      ],
    },
  ],
  featureCards: [
    { title: "Object Type", text: "描述业务对象，例如 User、Project、Issue。" },
    { title: "Root Query", text: "定义读取数据的入口字段。" },
    { title: "Scalar", text: "基础值类型，例如 String、ID、Boolean、Int。" },
    { title: "List / Non-null", text: "组合列表和非空，表达返回值约束。" },
    { title: "API Contract", text: "Schema 是前后端共享的能力边界和演进合同。" },
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
    {
      question: "Root Query 在 Schema 中起什么作用？",
      answer: "Root Query 定义读取数据的入口字段，客户端的查询会从这些入口开始选择字段。",
    },
    {
      question: "非空标记 ! 为什么需要谨慎使用？",
      answer: "因为它是服务端对客户端的强承诺；如果实际返回 null，GraphQL 会把错误向上层可空字段传播，可能导致更多数据变成 null。",
    },
    {
      question: "为什么说 Schema 是产品级 API 合同？",
      answer: "因为它不仅约束字段和类型，也影响前端使用方式、权限边界、字段演进、文档生成和团队协作。",
    },
  ],
};
