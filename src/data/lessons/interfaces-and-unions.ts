import type { Lesson } from "../../types";

export const interfacesAndUnions: Lesson = {
  id: "interfaces-and-unions",
  number: "07",
  title: "接口、联合类型与多态",
  summary: "用 interface、union、__typename 和 inline fragment 表达多种可能的返回类型。",
  sections: [
    {
      heading: "为什么需要多态类型",
      body: [
        "真实业务里，一个字段可能返回多种对象。例如搜索结果可能包含用户、仓库和文章；通知目标可能是 Issue、Pull Request 或评论。",
        "GraphQL 用 interface 和 union 表达这种多态能力，让 Schema 明确告诉客户端：这个字段可能返回哪些类型，以及哪些字段是公共字段。",
      ],
    },
    {
      heading: "interface 与 union 的区别",
      body: [
        "interface 要求实现类型拥有一组公共字段，客户端可以直接查询这些公共字段。union 只表示可能类型集合，不定义公共字段。",
        "如果这些类型确实共享语义和字段，优先考虑 interface；如果只是结果集合放在一起，但没有稳定公共字段，union 更合适。",
      ],
    },
    {
      heading: "__typename 和 inline fragment",
      body: [
        "__typename 是 GraphQL 内置字段，用来告诉客户端当前对象的实际类型。客户端缓存和 UI 分支都经常依赖它。",
        "当查询多态字段时，类型专属字段需要写在 inline fragment 中，例如 ... on Repository。这样查询仍然能被 Schema 校验。",
      ],
    },
    {
      heading: "服务端需要解析实际类型",
      body: [
        "多态字段返回对象后，GraphQL 服务端需要知道这个对象到底是哪一个具体类型。不同框架可能通过 __resolveType、isTypeOf 或对象上的类型标记来完成。",
        "类型解析逻辑应该稳定、可测试，并尽量避免依赖脆弱的字段猜测。否则客户端拿到的 __typename 可能不一致，缓存和 UI 分支都会出问题。",
      ],
    },
    {
      heading: "多态列表也要考虑分页",
      body: [
        "搜索结果、动态流和通知列表常常是多态列表。它们同样需要分页、排序和权限过滤，而且不同类型的排序字段可能并不一致。",
        "设计这类字段时，要先确定统一排序规则，例如相关性、创建时间或事件时间，再决定 cursor 如何编码。",
      ],
    },
  ],
  featureCards: [
    { title: "Interface", text: "定义公共字段，多个对象类型可以实现同一个接口。" },
    { title: "Union", text: "表达一个字段可能返回多种类型，但不声明公共字段。" },
    { title: "__typename", text: "返回对象的实际 GraphQL 类型名，常用于缓存和 UI 分支。" },
    { title: "Inline Fragment", text: "在多态结果中选择某个具体类型的专属字段。" },
    { title: "resolveType", text: "服务端把运行时对象映射到具体 GraphQL 类型。" },
    { title: "Polymorphic Lists", text: "多态列表也需要稳定排序、分页和权限过滤。" },
  ],
  examples: [
    {
      title: "多态搜索结果",
      language: "graphql",
      highlightLines: [1, 7, 12, 18],
      code: `interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}

type Repository implements Node {
  id: ID!
  name: String!
  stars: Int!
}

union SearchResult = User | Repository

type Query {
  search(keyword: String!): [SearchResult!]!
}`,
    },
    {
      title: "查询多态字段",
      language: "graphql",
      highlightLines: [4, 5, 9],
      code: `query Search($keyword: String!) {
  search(keyword: $keyword) {
    __typename
    ... on User {
      name
    }
    ... on Repository {
      name
      stars
    }
  }
}`,
    },
    {
      title: "服务端解析类型",
      language: "ts",
      highlightLines: [3, 4, 5],
      code: `const resolvers = {
  SearchResult: {
    __resolveType(result) {
      if (result.kind === "user") return "User";
      if (result.kind === "repository") return "Repository";

      // 返回 null 会让 GraphQL 报错，说明结果不符合 union 定义
      return null;
    },
  },
};`,
    },
  ],
  review: [
    {
      question: "interface 和 union 的核心区别是什么？",
      answer: "interface 定义公共字段，实现类型必须提供这些字段；union 只表示可能类型集合，不声明公共字段。",
    },
    {
      question: "__typename 常用来做什么？",
      answer: "它告诉客户端当前对象的实际类型，常用于 UI 分支、规范化缓存和调试多态响应。",
    },
    {
      question: "为什么类型专属字段要写在 inline fragment 中？",
      answer: "因为多态字段的静态类型不一定拥有这些字段，inline fragment 明确限定了字段只在某个具体类型上查询。",
    },
    {
      question: "什么时候更适合使用 union？",
      answer: "当多个返回类型只是被放在同一个结果集合里，但没有稳定公共字段或共同语义时，union 更直接。",
    },
    {
      question: "服务端为什么需要 __resolveType？",
      answer: "因为运行时返回的是普通对象，GraphQL 需要把它映射成 Schema 中的具体对象类型，客户端才能安全查询类型专属字段。",
    },
    {
      question: "多态搜索结果分页时最容易忽略什么？",
      answer: "容易忽略统一排序规则和 cursor 编码。不同类型混排时，必须有稳定排序依据，分页才不会重复或遗漏。",
    },
  ],
};
