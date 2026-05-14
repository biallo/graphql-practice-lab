import type { Lesson } from "../../types";

export const testingGraphqlApi: Lesson = {
  id: "testing-graphql-api",
  number: "18",
  title: "测试 GraphQL API",
  summary: "测试 resolver、operation、权限、错误响应和 Schema 演进，降低接口变更风险。",
  sections: [
    {
      heading: "测试应该覆盖行为而不是实现细节",
      body: [
        "GraphQL API 的测试重点是：给定一个 operation、变量和用户上下文，响应是否符合预期。",
        "resolver 单测可以覆盖复杂业务逻辑，但更关键的是 operation 级集成测试，因为它更接近真实客户端行为。",
      ],
    },
    {
      heading: "权限测试不能省",
      body: [
        "GraphQL 字段可以自由组合，权限测试应覆盖未登录、无权限、有权限、跨租户、字段级敏感数据等场景。",
        "只测试成功路径会留下很大风险，尤其是列表过滤和 DataLoader 批量读取很容易漏掉权限条件。",
      ],
    },
    {
      heading: "错误响应也要测试",
      body: [
        "业务错误 payload、GraphQL errors、extensions.code、null propagation 都应该有测试覆盖。",
        "测试错误响应可以避免前端依赖的错误形状被无意改坏。",
      ],
    },
  ],
  featureCards: [
    { title: "Resolver Unit Test", text: "适合复杂计算、权限函数和数据转换逻辑。" },
    { title: "Operation Test", text: "用真实 Query/Mutation 验证完整执行结果。" },
    { title: "Permission Matrix", text: "按用户角色、租户和对象状态覆盖权限组合。" },
    { title: "Schema Snapshot", text: "记录 Schema 变化，辅助发现意外破坏性变更。" },
  ],
  examples: [
    {
      title: "operation 集成测试",
      language: "ts",
      highlightLines: [4, 9, 13],
      code: `test("viewer can read own projects", async () => {
  const context = createTestContext({ userId: "u1" });

  const result = await executeGraphQL({
    query: \`
      query {
        viewer {
          projects(first: 10) {
            nodes { id name }
          }
        }
      }
    \`,
    context,
  });

  expect(result.errors).toBeUndefined();
  expect(result.data.viewer.projects.nodes).toHaveLength(2);
});`,
    },
    {
      title: "权限测试",
      language: "ts",
      highlightLines: [5, 10],
      code: `test("user cannot read project from another tenant", async () => {
  const context = createTestContext({ userId: "u1", tenantId: "t1" });

  const result = await executeGraphQL({
    query: "query { project(id: \\"project-from-t2\\") { id name } }",
    context,
  });

  expect(result.errors).toBeUndefined();
  expect(result.data.project).toBeNull();
});`,
    },
  ],
  review: [
    {
      question: "为什么 operation 级测试很重要？",
      answer: "它接近真实客户端请求，能同时覆盖 Schema、resolver、权限、错误和响应结构。",
    },
    {
      question: "权限测试应该覆盖哪些典型场景？",
      answer: "未登录、无权限、有权限、跨租户、对象级权限和字段级敏感数据。",
    },
    {
      question: "为什么错误响应也要写测试？",
      answer: "前端会依赖错误 code、payload 和 null 形状，测试能防止这些契约被无意破坏。",
    },
    {
      question: "Schema snapshot 的作用是什么？",
      answer: "帮助团队发现 Schema 变化，并结合兼容性检查判断是否有 breaking change。",
    },
  ],
};
