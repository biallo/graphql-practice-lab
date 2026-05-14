import type { Lesson } from "../../types";

export const errorsAndPartialResponses: Lesson = {
  id: "errors-and-partial-responses",
  number: "09",
  title: "错误处理与部分响应",
  summary: "系统理解 GraphQL 的 errors、业务错误 payload，以及客户端如何做降级展示。",
  sections: [
    {
      heading: "GraphQL 错误不只有一种",
      body: [
        "GraphQL 错误可以发生在解析、校验、执行等阶段。解析和校验失败时，通常不会执行 resolver；执行阶段的字段错误则可能只影响响应的一部分。",
        "客户端不能只用 HTTP 200 或 500 判断业务成功。GraphQL 响应体中的 data、errors 和业务 payload 都需要一起看。",
      ],
    },
    {
      heading: "字段错误与部分 data",
      body: [
        "字段 resolver 抛错时，GraphQL 会记录 errors，并根据字段是否可空决定 data 中对应位置是 null，还是继续向上层传播 null。",
        "这也是非空字段需要谨慎设计的原因。过多非空承诺可能让一个局部错误扩散成更大范围的数据缺失。",
      ],
    },
    {
      heading: "业务错误更适合放在 payload",
      body: [
        "表单校验失败、库存不足、无权限执行某个业务动作，这类可预期业务结果通常适合放在 Mutation payload 中。",
        "errors 更适合系统级、执行级或不可恢复错误。业务错误放 payload，客户端更容易做字段级提示和恢复操作。",
      ],
    },
    {
      heading: "extensions 可以承载机器可读信息",
      body: [
        "GraphQL errors 的 message 面向人类阅读，不适合让客户端写复杂判断。需要程序判断时，可以在 extensions 中放 code、requestId、retryAfter 等信息。",
        "错误 code 要稳定，message 可以调整。客户端应该依赖 code 做分支，而不是解析 message 文本。",
      ],
    },
    {
      heading: "错误策略要和 nullability 配合",
      body: [
        "如果某个字段失败后页面仍能降级展示，它应该保持可空。如果字段是页面不可缺少的核心数据，再考虑非空承诺。",
        "错误处理不是只在 resolver 里 try/catch，还包括 Schema 的可空性设计、业务 payload 设计和客户端降级策略。",
      ],
    },
  ],
  featureCards: [
    { title: "Transport Status", text: "HTTP 状态只能说明传输层，不一定代表 GraphQL 业务结果。" },
    { title: "GraphQL errors", text: "描述解析、校验或执行阶段的错误，通常包含 message 和 path。" },
    { title: "Business Errors", text: "可预期的业务失败适合放在 payload 中返回给客户端。" },
    { title: "Null Propagation", text: "非空字段失败时，null 会向上层可空字段传播。" },
    { title: "extensions.code", text: "提供稳定的机器可读错误码，避免客户端解析 message。" },
    { title: "Graceful Fallback", text: "可降级字段保持可空，让页面能展示部分内容。" },
  ],
  examples: [
    {
      title: "业务错误 payload",
      language: "graphql",
      highlightLines: [7, 11],
      code: `type Mutation {
  createProject(input: CreateProjectInput!): CreateProjectPayload!
}

type CreateProjectPayload {
  project: Project
  userErrors: [UserError!]!
}

type UserError {
  field: [String!]!
  message: String!
}`,
    },
    {
      title: "客户端请求业务错误",
      language: "graphql",
      highlightLines: [5, 8],
      code: `mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    project {
      id
      name
    }
    userErrors {
      field
      message
    }
  }
}`,
    },
    {
      title: "带扩展信息的执行错误",
      language: "json",
      highlightLines: [5, 8, 9],
      code: `{
  "data": {
    "viewer": null
  },
  "errors": [
    {
      "message": "Authentication required",
      "path": ["viewer"],
      "extensions": {
        "code": "UNAUTHENTICATED",
        "requestId": "req_123"
      }
    }
  ]
}`,
    },
  ],
  review: [
    {
      question: "为什么不能只用 HTTP 状态判断 GraphQL 请求是否业务成功？",
      answer: "因为 GraphQL 可能在 HTTP 200 中返回 errors 或业务 payload 错误，传输成功不等于字段执行或业务动作成功。",
    },
    {
      question: "业务错误为什么适合放在 payload 中？",
      answer: "业务错误通常是可预期结果，放在 payload 中更方便客户端展示字段级提示、保留表单状态并继续操作。",
    },
    {
      question: "非空字段错误为什么可能扩大影响范围？",
      answer: "非空字段不能返回 null，一旦失败，null 会向上层可空字段传播，可能导致整个父对象缺失。",
    },
    {
      question: "errors.path 有什么价值？",
      answer: "它帮助客户端和开发者定位哪个字段或列表位置发生了执行错误。",
    },
    {
      question: "客户端为什么不应该解析 errors.message 做业务分支？",
      answer: "message 是给人看的文本，可能变化；业务分支应该依赖 extensions.code 这类稳定机器可读字段。",
    },
    {
      question: "字段可空性和错误处理有什么关系？",
      answer: "可空字段失败时更容易局部降级，非空字段失败会触发 null 传播，可能让更大范围数据缺失。",
    },
  ],
};
