import type { Lesson } from "../../types";

export const clientCache: Lesson = {
  id: "client-cache",
  number: "14",
  title: "客户端缓存基础",
  summary: "理解规范化缓存、对象标识、Mutation 后缓存更新，以及客户端数据一致性。",
  sections: [
    {
      heading: "为什么 GraphQL 客户端常用规范化缓存",
      body: [
        "同一个对象可能出现在多个查询结果里。规范化缓存会按类型名和 id 把对象拆开存储，让多个视图共享同一份对象数据。",
        "当某个对象更新时，缓存可以让所有引用它的页面一起反映变化。",
      ],
    },
    {
      heading: "对象标识很关键",
      body: [
        "客户端通常用 __typename + id 识别对象。如果类型缺少稳定 id，缓存就很难知道两个响应里的对象是不是同一个实体。",
        "这也是为什么很多 GraphQL Schema 会给业务对象提供 ID 字段。",
      ],
    },
    {
      heading: "Mutation 后如何同步 UI",
      body: [
        "Mutation 返回被修改对象，客户端缓存就能自动合并字段。对于新增、删除或分页列表，还可能需要手动更新列表引用或重新请求。",
        "缓存策略要和产品体验匹配：有些场景需要乐观更新，有些场景更适合等待服务端确认。",
      ],
    },
    {
      heading: "缓存策略要按场景选择",
      body: [
        "cache-first 适合变化慢、重复访问的数据；network-only 适合强实时或强一致场景；cache-and-network 适合先快速展示旧数据，再刷新最新数据。",
        "缓存策略不是全局唯一答案。不同页面、不同字段、不同业务风险都可能需要不同策略。",
      ],
    },
    {
      heading: "乐观更新要能回滚",
      body: [
        "乐观更新能让界面更快，但服务端最终可能失败。客户端需要能根据 Mutation 结果回滚，或用服务端返回值覆盖乐观结果。",
        "对于权限、支付、库存等强一致场景，乐观更新要格外谨慎。",
      ],
    },
  ],
  featureCards: [
    { title: "Normalized Cache", text: "把嵌套响应拆成实体表，多个查询共享同一对象。" },
    { title: "__typename + id", text: "常见对象缓存键，要求对象有稳定标识。" },
    { title: "Optimistic UI", text: "先按预期结果更新界面，再等待服务端确认。" },
    { title: "Refetch vs Update", text: "复杂列表可重新请求，简单对象更新可直接写缓存。" },
    { title: "Fetch Policy", text: "按数据变化频率和一致性要求选择缓存策略。" },
    { title: "Rollback", text: "乐观更新失败后要能回滚或用服务端结果覆盖。" },
  ],
  examples: [
    {
      title: "Mutation 返回被修改对象",
      language: "graphql",
      highlightLines: [4, 5, 6],
      code: `mutation RenameProject($id: ID!, $name: String!) {
  renameProject(id: $id, name: $name) {
    project {
      __typename
      id
      name
    }
    userErrors {
      message
    }
  }
}`,
    },
    {
      title: "查询对象标识",
      language: "graphql",
      highlightLines: [4, 5],
      code: `query ProjectCard($id: ID!) {
  project(id: $id) {
    __typename
    id
    name
    owner {
      __typename
      id
      name
    }
  }
}`,
    },
  ],
  review: [
    {
      question: "规范化缓存解决什么问题？",
      answer: "它让同一个对象在不同查询结果中共享同一份缓存数据，减少重复存储并提升 UI 一致性。",
    },
    {
      question: "为什么 __typename + id 很重要？",
      answer: "客户端需要稳定键来判断两个响应对象是否代表同一个实体。",
    },
    {
      question: "Mutation 后为什么建议返回被修改对象？",
      answer: "这样客户端缓存可以直接合并最新字段，减少额外请求和手动同步。",
    },
    {
      question: "什么时候可能需要手动更新缓存列表？",
      answer: "新增、删除、分页列表变化时，只返回对象本身未必能让列表引用自动变化，可能需要手动更新或重新请求。",
    },
    {
      question: "为什么缓存策略要按场景选择？",
      answer: "因为不同数据的变化频率和一致性要求不同，静态数据适合优先缓存，强实时数据更适合请求网络。",
    },
    {
      question: "乐观更新最大的风险是什么？",
      answer: "服务端最终可能失败或返回不同结果，所以客户端必须能回滚或用服务端结果覆盖乐观状态。",
    },
  ],
};
