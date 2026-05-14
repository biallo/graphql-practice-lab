import type { Lesson } from "../../types";

export const subscriptions: Lesson = {
  id: "subscriptions",
  number: "13",
  title: "Subscription 实时数据",
  summary: "理解 Subscription 的适用场景、传输方式，以及它和 Query/Mutation 的区别。",
  sections: [
    {
      heading: "Subscription 解决什么问题",
      body: [
        "Query 读取当前状态，Mutation 修改状态，Subscription 用于让服务端在事件发生时主动把新数据推给客户端。",
        "它适合聊天消息、通知、协作状态、构建进度等实时性较强的场景。",
      ],
    },
    {
      heading: "不是所有刷新都需要 Subscription",
      body: [
        "如果数据变化频率低，轮询、重新请求或缓存失效可能更简单。Subscription 会引入长连接、鉴权续期、断线重连和资源管理问题。",
        "实时能力应该用在用户确实需要即时反馈的地方，而不是所有列表都默认实时。",
      ],
    },
    {
      heading: "传输和事件源",
      body: [
        "Subscription 常见传输方式包括 WebSocket 和 Server-Sent Events。GraphQL 层定义订阅字段和返回形状，底层事件可能来自消息队列、数据库监听或应用内事件总线。",
      ],
    },
    {
      heading: "订阅不是可靠消息队列",
      body: [
        "Subscription 更像实时通知通道，不应该默认承担严格消息投递、离线补偿和 exactly-once 语义。",
        "如果用户离线后必须补齐事件，需要把事件持久化，并在重新连接后通过 Query 拉取缺失数据。",
      ],
    },
    {
      heading: "推送前也要重新检查权限",
      body: [
        "用户建立订阅时有权限，不代表几分钟后仍然有权限。成员权限、项目可见性或 token 状态都可能变化。",
        "敏感数据推送前应重新校验权限，或者让事件只携带 ID，再由客户端通过普通 Query 读取最新可见数据。",
      ],
    },
  ],
  featureCards: [
    { title: "Long-lived Connection", text: "订阅通常依赖长连接，需要处理连接生命周期。" },
    { title: "Event Source", text: "事件可来自消息队列、数据库通知或应用事件总线。" },
    { title: "Reconnect", text: "客户端需要处理断线重连和重复事件。" },
    { title: "Authorization", text: "订阅开始和事件推送时都要考虑权限是否仍然有效。" },
    { title: "Delivery Semantics", text: "订阅通常不保证离线期间事件完整送达，需要补偿查询。" },
    { title: "Fan-out", text: "多实例部署时要用共享 pub/sub 或消息系统分发事件。" },
  ],
  examples: [
    {
      title: "订阅新评论",
      language: "graphql",
      highlightLines: [1, 2],
      code: `type Subscription {
  commentAdded(issueId: ID!): Comment!
}

type Comment {
  id: ID!
  body: String!
  author: User!
}`,
    },
    {
      title: "客户端订阅",
      language: "graphql",
      highlightLines: [1, 3, 6],
      code: `subscription OnCommentAdded($issueId: ID!) {
  commentAdded(issueId: $issueId) {
    id
    body
    author {
      name
    }
  }
}`,
    },
    {
      title: "推送前检查权限",
      language: "ts",
      highlightLines: [5, 9],
      code: `async function publishCommentAdded({ comment, pubsub, auth }) {
  const subscribers = await pubsub.subscribers(\`issue:\${comment.issueId}\`);

  for (const subscriber of subscribers) {
    const canRead = await auth.canReadIssue(subscriber.user, comment.issueId);
    if (!canRead) continue;

    pubsub.publish(subscriber.id, {
      commentAdded: comment,
    });
  }
}`,
    },
  ],
  review: [
    {
      question: "Subscription 和 Query 的区别是什么？",
      answer: "Query 是一次性读取当前数据，Subscription 是建立订阅后由服务端在事件发生时持续推送数据。",
    },
    {
      question: "哪些场景适合 Subscription？",
      answer: "聊天、通知、协作状态、构建进度等用户需要即时反馈的场景。",
    },
    {
      question: "为什么不要把所有刷新都做成 Subscription？",
      answer: "因为实时连接会带来连接管理、重连、鉴权和服务端资源成本，低频变化用重新请求或轮询更简单。",
    },
    {
      question: "Subscription 为什么通常不适合承担离线补偿？",
      answer: "订阅连接断开后事件可能丢失，必须完整补齐的场景应该持久化事件，并通过 Query 拉取缺失数据。",
    },
    {
      question: "为什么推送事件前还要检查权限？",
      answer: "订阅建立后用户权限可能变化，推送前复查可以避免把敏感数据发给已经失去权限的连接。",
    },
  ],
};
