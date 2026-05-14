import type { Lesson } from "../../types";

export const paginationConnections: Lesson = {
  id: "pagination-connections",
  number: "08",
  title: "分页与连接模型",
  summary: "理解 offset 分页、cursor 分页，以及 GraphQL 中常见的 Connection 设计。",
  sections: [
    {
      heading: "分页是列表字段的基本能力",
      body: [
        "GraphQL 允许客户端选择嵌套字段，如果列表没有分页，一次查询可能返回大量数据，影响响应时间和服务稳定性。",
        "任何可能增长的列表字段，都应该尽早设计分页参数和分页响应结构，而不是等数据变大后再补。",
      ],
    },
    {
      heading: "offset 与 cursor 的取舍",
      body: [
        "offset 分页简单，适合后台管理、稳定排序和数据量较小的场景。但数据插入或删除时，用户可能看到重复或遗漏。",
        "cursor 分页用游标描述当前位置，适合动态列表和无限滚动。它更稳定，但服务端需要维护排序字段和游标编码规则。",
      ],
    },
    {
      heading: "Connection 模型",
      body: [
        "GraphQL 社区常用 Connection 模型表达分页：Connection 包含 edges、nodes 和 pageInfo，edge 可以承载关系上的额外信息。",
        "如果只是展示列表，nodes 更轻；如果需要 cursor 或关系元数据，edges 更完整。",
      ],
    },
    {
      heading: "cursor 必须基于稳定排序",
      body: [
        "cursor 不是简单把 offset 做 base64。可靠 cursor 通常包含排序字段和唯一 ID，例如 createdAt + id，用来稳定定位下一页起点。",
        "排序字段必须稳定且可重复执行。如果只按非唯一字段排序，翻页时很容易出现重复或遗漏。",
      ],
    },
    {
      heading: "totalCount 不是免费字段",
      body: [
        "很多产品想展示总数，但 totalCount 可能触发昂贵的 count 查询，尤其在权限过滤、复杂搜索和大表上成本很高。",
        "如果总数不是核心体验，可以考虑不返回 totalCount，或返回近似值、延迟值、单独字段，并明确它的成本。",
      ],
    },
  ],
  featureCards: [
    { title: "Offset Pagination", text: "用 limit/offset 或 page/pageSize 表达页码，简单但对动态数据不稳定。" },
    { title: "Cursor Pagination", text: "用 after/before 和 first/last 表达位置，更适合实时变化的列表。" },
    { title: "pageInfo", text: "返回 hasNextPage、endCursor 等信息，帮助客户端继续请求下一页。" },
    { title: "edges vs nodes", text: "nodes 直接给对象；edges 适合附带 cursor 或关系字段。" },
    { title: "Stable Sort", text: "cursor 分页依赖稳定排序，常用 createdAt + id 作为组合游标。" },
    { title: "totalCount Cost", text: "总数查询可能很贵，应该根据产品价值谨慎暴露。" },
  ],
  examples: [
    {
      title: "Connection Schema",
      language: "graphql",
      highlightLines: [2, 7, 13],
      code: `type Query {
  repositories(first: Int!, after: String): RepositoryConnection!
}

type RepositoryConnection {
  nodes: [Repository!]!
  edges: [RepositoryEdge!]!
  pageInfo: PageInfo!
}

type RepositoryEdge {
  cursor: String!
  node: Repository!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}`,
    },
    {
      title: "请求下一页",
      language: "graphql",
      highlightLines: [2, 8, 9],
      code: `query RepositoryPage($after: String) {
  repositories(first: 20, after: $after) {
    nodes {
      id
      name
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`,
    },
    {
      title: "基于组合游标查询",
      language: "ts",
      highlightLines: [2, 7, 12],
      code: `function decodeCursor(cursor: string) {
  // cursor 中包含 createdAt 和 id，避免只靠 offset 定位
  return JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
}

async function findNextPage({ after, first }) {
  const cursor = after ? decodeCursor(after) : null;

  return db.repository.findMany({
    where: cursor
      ? { createdAt_lte_id_lt: [cursor.createdAt, cursor.id] }
      : {},
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: first + 1,
  });
}`,
    },
  ],
  review: [
    {
      question: "为什么列表字段应该尽早设计分页？",
      answer: "因为列表会随业务增长而变大，没有分页会导致响应过重，也让客户端难以控制加载节奏。",
    },
    {
      question: "offset 分页的主要缺点是什么？",
      answer: "当数据在翻页过程中新增或删除时，offset 可能导致重复或遗漏。",
    },
    {
      question: "Connection 中 pageInfo 的作用是什么？",
      answer: "它告诉客户端是否还有下一页、下一次请求应该从哪个 cursor 继续。",
    },
    {
      question: "什么时候需要 edges 而不是只返回 nodes？",
      answer: "当客户端需要 cursor 或关系上的额外字段时，例如加入时间、排序原因、关系状态等。",
    },
    {
      question: "为什么 cursor 应该包含稳定排序字段？",
      answer: "因为翻页需要从上一次结果的确定位置继续，稳定排序字段加唯一 ID 能减少重复和遗漏。",
    },
    {
      question: "totalCount 为什么要谨慎暴露？",
      answer: "因为它可能触发昂贵的 count 查询，尤其在复杂过滤、权限判断或大数据量场景下成本很高。",
    },
  ],
};
