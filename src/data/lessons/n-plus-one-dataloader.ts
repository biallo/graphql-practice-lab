import type { Lesson } from "../../types";

export const nPlusOneDataloader: Lesson = {
  id: "n-plus-one-dataloader",
  number: "11",
  title: "N+1 与 DataLoader",
  summary: "理解嵌套 resolver 如何造成 N+1 查询，并用批量加载和请求级缓存治理性能。",
  sections: [
    {
      heading: "N+1 是怎么发生的",
      body: [
        "GraphQL 按字段执行 resolver。查询一个列表后，如果列表里每个对象的子字段都单独查一次数据库，就会出现 1 次列表查询 + N 次子查询。",
        "数据量小时 N+1 不明显，业务增长后会快速放大数据库压力。",
      ],
    },
    {
      heading: "DataLoader 的核心思想",
      body: [
        "DataLoader 把同一轮事件循环里的多个 load 合并成一次批量请求，并把结果按 key 对齐返回。",
        "它通常是请求级实例：同一个请求内复用缓存，不同请求之间隔离，避免用户数据串漏。",
      ],
    },
    {
      heading: "不要滥用缓存",
      body: [
        "DataLoader 缓存是为了解决同一请求内重复读取，不等同于全局业务缓存。",
        "如果数据会在同一请求内被修改，要考虑清理 loader 缓存或让 Mutation 返回最新对象。",
      ],
    },
    {
      heading: "Mutation 后要处理缓存失效",
      body: [
        "如果同一个请求里先读取对象，再 Mutation 更新对象，DataLoader 可能还缓存着旧值。此时要 clear 对应 key，或 prime 最新值。",
        "不要把 DataLoader 当成跨请求缓存。跨请求缓存需要单独考虑过期时间、权限隔离和主动失效。",
      ],
    },
    {
      heading: "通过日志识别 N+1",
      body: [
        "排查 N+1 时，可以记录一次 GraphQL 请求内的 SQL 数量、重复 SQL 模板、resolver 路径和耗时。",
        "如果同一个字段路径反复触发相同查询，只是参数不同，通常就是 DataLoader 或批量查询应该介入的位置。",
      ],
    },
  ],
  featureCards: [
    { title: "N+1", text: "一个父列表触发 N 次子字段读取，是嵌套 resolver 的常见性能问题。" },
    { title: "Batch Loading", text: "把多个 key 合并成一次批量读取，降低数据库往返次数。" },
    { title: "Request Cache", text: "同一请求内缓存相同 key 的读取结果，避免重复查询。" },
    { title: "Key Order", text: "批量函数返回结果必须和输入 key 顺序对齐。" },
    { title: "clear / prime", text: "Mutation 后清理旧缓存，或写入最新对象，避免同请求读到旧值。" },
    { title: "Query Logs", text: "用 SQL 数量、resolver 路径和重复查询模板定位 N+1。" },
  ],
  examples: [
    {
      title: "请求级 DataLoader",
      language: "ts",
      highlightLines: [2, 6, 13],
      code: `function createContext({ db, user }) {
  const userById = new DataLoader(async (ids) => {
    const users = await db.user.findManyByIds(ids);
    const userMap = new Map(users.map((user) => [user.id, user]));

    // 返回顺序必须和 ids 一一对应
    return ids.map((id) => userMap.get(id) ?? null);
  });

  return {
    user,
    db,
    loaders: { userById },
  };
}`,
    },
    {
      title: "resolver 中使用 loader",
      language: "ts",
      highlightLines: [4],
      code: `const resolvers = {
  Issue: {
    author: (issue, _args, context) => {
      return context.loaders.userById.load(issue.authorId);
    },
  },
};`,
    },
    {
      title: "Mutation 后刷新 loader 缓存",
      language: "ts",
      highlightLines: [5, 8],
      code: `const resolvers = {
  Mutation: {
    renameUser: async (_parent, args, context) => {
      const user = await context.db.user.rename(args.id, args.name);

      context.loaders.userById.clear(args.id).prime(args.id, user);

      return { user, userErrors: [] };
    },
  },
};`,
    },
  ],
  review: [
    {
      question: "GraphQL 中 N+1 通常怎么发生？",
      answer: "父列表返回 N 个对象后，每个对象的子字段 resolver 又单独发起一次数据读取，就形成 N+1。",
    },
    {
      question: "DataLoader 的两个核心能力是什么？",
      answer: "批量合并读取和请求级缓存。",
    },
    {
      question: "为什么 DataLoader 通常应该是请求级实例？",
      answer: "这样可以隔离用户和权限上下文，避免跨请求缓存导致数据泄露或过期。",
    },
    {
      question: "批量函数为什么要按输入 key 顺序返回结果？",
      answer: "DataLoader 需要把每个返回值对应回原来的 load key，顺序不一致会导致字段拿到错误对象。",
    },
    {
      question: "Mutation 后为什么可能要 clear 或 prime DataLoader？",
      answer: "因为同一请求内 loader 可能缓存了旧值，更新后需要清理旧 key 或写入最新对象，避免后续字段读到过期数据。",
    },
    {
      question: "如何通过日志识别 N+1？",
      answer: "观察同一次 GraphQL 请求内是否出现大量相同 SQL 模板或相同 resolver 路径的重复读取。",
    },
  ],
};
