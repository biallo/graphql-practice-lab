import type { Lesson } from "../../types";

export const practicalApiDesign: Lesson = {
  id: "practical-api-design",
  number: "16",
  title: "GraphQL 项目实战设计",
  summary: "把 Schema、Query、Mutation、分页、权限和错误处理组合成一个可维护 API。",
  sections: [
    {
      heading: "从用户场景开始设计",
      body: [
        "GraphQL Schema 不应该从数据库表直接翻译，而应该从页面和业务任务出发：用户要查看什么、修改什么、哪些信息需要一起出现。",
        "先列出核心对象、核心列表和核心动作，再决定 Query、Mutation、分页和权限边界。",
      ],
    },
    {
      heading: "为任务管理系统设计 API",
      body: [
        "以任务管理为例，核心对象可能包括 Project、Task、User、Comment。读取入口包括项目列表、任务详情、我的任务；写入口包括创建任务、更新状态、添加评论。",
        "列表字段要分页，写操作要返回 payload，敏感字段要做权限控制，复杂关系要考虑 DataLoader。",
      ],
    },
    {
      heading: "检查设计是否可维护",
      body: [
        "好的设计应该命名清晰、类型稳定、错误可展示、权限可测试、列表可分页、性能可治理。",
        "如果一个字段需要客户端猜测含义，或者一个 Mutation 只返回 Boolean，通常说明 API 还可以更贴近业务流程。",
      ],
    },
    {
      heading: "把横切问题写进设计",
      body: [
        "实战设计不只是列类型。分页上限、权限策略、错误形状、DataLoader、查询复杂度和字段演进，都应该在设计阶段就写清楚。",
        "否则 API 初期看起来很快，后续会在性能、权限和兼容性上不断补洞。",
      ],
    },
    {
      heading: "从一个页面推导查询",
      body: [
        "以任务详情页为例，页面需要任务标题、状态、负责人、评论分页、当前用户权限和可执行动作。Query 应该贴近页面读取需求，但不要把页面名字硬编码进 Schema。",
        "Schema 表达业务能力，页面查询组合这些能力。这样多个页面可以复用相同对象和字段。",
      ],
    },
  ],
  featureCards: [
    { title: "User Journey First", text: "从页面和任务出发设计 API，而不是照搬数据库。" },
    { title: "Typed Payload", text: "Mutation 返回对象、业务错误和必要状态。" },
    { title: "Pagination by Default", text: "增长型列表默认分页，避免未来迁移成本。" },
    { title: "Operational Checks", text: "把权限、性能、错误和演进纳入设计检查清单。" },
    { title: "Page-driven Queries", text: "从页面数据需求推导查询，但 Schema 仍表达通用业务能力。" },
    { title: "Design Review", text: "上线前检查分页、权限、错误、缓存、复杂度和演进风险。" },
  ],
  examples: [
    {
      title: "任务系统 Schema 草图",
      language: "graphql",
      highlightLines: [2, 7, 15, 20],
      code: `type Query {
  project(id: ID!): Project
  myTasks(first: Int!, after: String): TaskConnection!
}

type Mutation {
  createTask(input: CreateTaskInput!): CreateTaskPayload!
  updateTaskStatus(input: UpdateTaskStatusInput!): UpdateTaskStatusPayload!
}

type Project {
  id: ID!
  name: String!
  tasks(first: Int!, after: String): TaskConnection!
}

type Task {
  id: ID!
  title: String!
  status: TaskStatus!
  assignee: User
}`,
    },
    {
      title: "创建任务 payload",
      language: "graphql",
      highlightLines: [6, 7],
      code: `input CreateTaskInput {
  projectId: ID!
  title: String!
}

type CreateTaskPayload {
  task: Task
  userErrors: [UserError!]!
}`,
    },
    {
      title: "任务详情页查询",
      language: "graphql",
      highlightLines: [5, 10, 15],
      code: `query TaskDetail($id: ID!, $commentsAfter: String) {
  task(id: $id) {
    id
    title
    status
    assignee {
      id
      name
    }
    viewerPermissions {
      canEdit
      canComment
    }
    comments(first: 20, after: $commentsAfter) {
      nodes {
        id
        body
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`,
    },
  ],
  review: [
    {
      question: "为什么实战设计不应该直接照搬数据库表？",
      answer: "数据库结构服务于存储，GraphQL Schema 服务于客户端任务和业务语言，两者边界不同。",
    },
    {
      question: "设计一个列表字段时应该优先考虑什么？",
      answer: "是否会增长、如何分页、默认排序是什么、权限如何过滤，以及是否会造成高成本查询。",
    },
    {
      question: "一个可维护的 Mutation payload 通常包含什么？",
      answer: "通常包含被创建或修改的对象、业务错误列表，以及客户端刷新界面所需的状态。",
    },
    {
      question: "实战设计检查清单应该覆盖哪些方面？",
      answer: "命名、类型稳定性、分页、权限、错误处理、性能治理和后续演进。",
    },
    {
      question: "为什么横切问题要在设计阶段处理？",
      answer: "分页、权限、错误、性能和演进都会影响 Schema 形状，后补通常会造成 breaking change 或大量迁移成本。",
    },
    {
      question: "页面查询和 Schema 设计的关系是什么？",
      answer: "页面查询应该组合 Schema 提供的业务能力；Schema 不应只服务某一个页面，而要表达可复用的业务对象和动作。",
    },
  ],
};
