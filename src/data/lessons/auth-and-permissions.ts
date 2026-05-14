import type { Lesson } from "../../types";

export const authAndPermissions: Lesson = {
  id: "auth-and-permissions",
  number: "10",
  title: "鉴权与权限设计",
  summary: "在 context 和 resolver 中处理用户身份、对象权限和字段级访问控制。",
  sections: [
    {
      heading: "认证与授权要分清",
      body: [
        "认证回答“你是谁”，授权回答“你能做什么”。GraphQL 服务通常在请求进入时解析 token，把当前用户放进 context。",
        "resolver 再根据 context 中的用户、字段参数和目标对象判断是否允许读取或修改。",
      ],
    },
    {
      heading: "权限不能只放在前端",
      body: [
        "前端隐藏按钮只能改善体验，不能保护数据。GraphQL 的字段可以被客户端自由组合，请求者仍然可能手写查询访问敏感字段。",
        "真正的权限边界必须在服务端 resolver 或数据访问层执行。",
      ],
    },
    {
      heading: "字段级与对象级权限",
      body: [
        "对象级权限决定用户能不能访问某个 Project、Issue 或订单。字段级权限决定同一个对象上的某些字段是否可见。",
        "字段级权限要谨慎使用：它很灵活，但过多字段权限会增加测试和缓存复杂度。",
      ],
    },
    {
      heading: "认证失败和无权限要区分",
      body: [
        "未登录通常返回 UNAUTHENTICATED，引导用户登录。已登录但无权访问通常返回 FORBIDDEN，或在对象读取场景返回 null 隐藏资源存在性。",
        "是否隐藏资源存在性要按业务风险决定。公开资源可以明确返回无权限，敏感资源则常用 null 或 not found 避免枚举。",
      ],
    },
    {
      heading: "多租户权限要下沉到数据层",
      body: [
        "多租户系统不能只在 resolver 里判断一次 tenantId。列表查询、详情查询、批量加载和搜索都必须带上租户条件。",
        "更稳妥的做法是把 tenant scope 封装进数据访问层，让每个 resolver 默认只能访问当前租户的数据。",
      ],
    },
  ],
  featureCards: [
    { title: "context.user", text: "请求级身份信息通常放在 context 中传给 resolver。" },
    { title: "Object Permission", text: "判断当前用户是否能访问某个业务对象。" },
    { title: "Field Permission", text: "对敏感字段做额外控制，例如邮箱、成本、内部备注。" },
    { title: "Deny by Default", text: "敏感能力默认拒绝，明确授权后再开放。" },
    { title: "UNAUTHENTICATED", text: "请求者身份未知，通常需要登录或刷新凭证。" },
    { title: "Tenant Scope", text: "多租户过滤应进入数据访问层，避免 resolver 遗漏条件。" },
  ],
  examples: [
    {
      title: "resolver 中检查权限",
      language: "ts",
      highlightLines: [3, 8, 13],
      code: `const resolvers = {
  Query: {
    project: async (_parent, args, context) => {
      const project = await context.db.project.findById(args.id);

      if (!project || !context.auth.canReadProject(context.user, project)) {
        // 不泄露对象是否存在，避免信息枚举
        return null;
      }

      return project;
    },
  },
};`,
    },
    {
      title: "字段级权限",
      language: "ts",
      highlightLines: [4, 5],
      code: `const resolvers = {
  User: {
    email: (user, _args, context) => {
      if (context.user.id !== user.id && !context.user.isAdmin) {
        return null;
      }
      return user.email;
    },
  },
};`,
    },
    {
      title: "租户范围数据访问",
      language: "ts",
      highlightLines: [4, 8],
      code: `function createProjectRepository(db, tenantId) {
  return {
    findById(id) {
      return db.project.findFirst({
        where: { id, tenantId },
      });
    },
    list() {
      return db.project.findMany({
        where: { tenantId },
      });
    },
  };
}`,
    },
  ],
  review: [
    {
      question: "认证和授权有什么区别？",
      answer: "认证确认请求者是谁，授权判断这个请求者是否可以执行某个操作或访问某份数据。",
    },
    {
      question: "为什么权限不能只靠前端控制？",
      answer: "因为 GraphQL 查询可以被手写，前端隐藏 UI 不能阻止请求者直接请求敏感字段。",
    },
    {
      question: "context 在鉴权中通常放什么？",
      answer: "通常放当前用户、角色、租户、权限工具和请求级数据源。",
    },
    {
      question: "字段级权限的代价是什么？",
      answer: "它会增加 resolver、测试和缓存复杂度，过多使用会让 API 行为难以预测。",
    },
    {
      question: "UNAUTHENTICATED 和 FORBIDDEN 应该如何区分？",
      answer: "UNAUTHENTICATED 表示请求者未登录或身份无效；FORBIDDEN 表示身份已确认，但没有权限执行当前操作。",
    },
    {
      question: "多租户系统为什么要把 tenant scope 下沉到数据层？",
      answer: "因为列表、详情、搜索和批量加载都需要租户过滤，下沉到数据层能减少 resolver 遗漏条件造成的数据泄露。",
    },
  ],
};
