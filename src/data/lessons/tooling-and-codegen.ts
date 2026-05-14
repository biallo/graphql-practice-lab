import type { Lesson } from "../../types";

export const toolingAndCodegen: Lesson = {
  id: "tooling-and-codegen",
  number: "17",
  title: "工具链与 Codegen",
  summary: "把 Schema 的类型优势接入开发流程：调试工具、文档、查询校验和类型生成。",
  sections: [
    {
      heading: "工具链让 Schema 真正有价值",
      body: [
        "GraphQL 的强类型优势不只体现在服务端校验，还应该进入日常开发：自动补全、文档浏览、查询校验、变量类型和响应类型都可以由 Schema 驱动。",
        "如果团队只把 GraphQL 当成字符串请求，而没有工具链，很多类型优势会被浪费。",
      ],
    },
    {
      heading: "常见开发工具",
      body: [
        "GraphiQL、Apollo Sandbox、Altair 等工具可以浏览 Schema、编写 Query、传变量、查看响应和错误。",
        "这些工具适合调试和学习，但生产权限、复杂度限制、persisted queries 等策略仍然必须由服务端保证。",
      ],
    },
    {
      heading: "Code Generator 的价值",
      body: [
        "GraphQL Code Generator 可以基于 Schema 和 Operation 生成 TypeScript 类型、SDK 或框架 hooks，减少手写类型和响应结构不一致的问题。",
        "更好的工作流是：先写 operation，再生成变量类型和响应类型，让组件使用真实查询结果类型，而不是手写近似类型。",
      ],
    },
  ],
  featureCards: [
    { title: "GraphiQL / Sandbox", text: "用于浏览 Schema、调试 Query 和验证变量。" },
    { title: "Schema Docs", text: "由类型和字段说明自动生成 API 文档。" },
    { title: "Operation Validation", text: "在开发和 CI 中提前发现无效字段、变量和类型错误。" },
    { title: "Codegen", text: "从 Schema 和 Operation 生成变量类型、响应类型或客户端 SDK。" },
  ],
  examples: [
    {
      title: "Codegen 配置示例",
      language: "ts",
      highlightLines: [2, 5, 8],
      code: `const config = {
  schema: "http://localhost:4000/graphql",
  documents: "src/**/*.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
};`,
    },
    {
      title: "组件使用生成类型",
      language: "ts",
      highlightLines: [1, 4],
      code: `import type { ProjectCardFragment } from "../generated/graphql";

function ProjectCard({ project }: { project: ProjectCardFragment }) {
  return project.name;
}`,
    },
  ],
  review: [
    {
      question: "GraphQL 工具链的核心价值是什么？",
      answer: "把 Schema 的类型信息带入开发、调试、校验、文档和类型生成流程，减少运行时才发现的问题。",
    },
    {
      question: "为什么不建议前端手写 GraphQL 响应类型？",
      answer: "手写类型容易和实际 operation 不一致，字段增删后也难以及时同步。",
    },
    {
      question: "Codegen 通常依赖哪两类输入？",
      answer: "依赖 Schema 和客户端编写的 GraphQL operations。",
    },
    {
      question: "调试工具能替代服务端安全策略吗？",
      answer: "不能。调试工具只改善开发体验，权限、复杂度、限流和 persisted queries 仍要由服务端保证。",
    },
  ],
};
