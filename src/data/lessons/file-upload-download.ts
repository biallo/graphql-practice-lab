import type { Lesson } from "../../types";

export const fileUploadDownload: Lesson = {
  id: "file-upload-download",
  number: "20",
  title: "文件上传与下载",
  summary: "理解为什么文件流不一定适合 GraphQL，以及 signed URL 和专用上传通道的设计。",
  sections: [
    {
      heading: "GraphQL 不擅长传大文件",
      body: [
        "GraphQL 最擅长结构化数据查询和变更，不适合直接承载大型二进制流。把文件塞进 GraphQL 请求会增加网关、服务器和重试复杂度。",
        "上传下载通常更适合走对象存储、CDN 或专用 HTTP endpoint，GraphQL 负责生成凭证、记录元数据和关联业务对象。",
      ],
    },
    {
      heading: "Signed URL 是常见方案",
      body: [
        "客户端先通过 Mutation 请求上传凭证，服务端返回 signed URL、文件 ID 和限制条件。客户端再直接把文件上传到对象存储。",
        "上传完成后，客户端调用另一个 Mutation 提交文件元数据，服务端再把文件和业务对象关联起来。",
      ],
    },
    {
      heading: "下载也要考虑权限和过期",
      body: [
        "下载链接不应该永久公开。服务端可以按用户权限生成短期 signed URL，或者让下载 endpoint 做鉴权后重定向。",
        "敏感文件需要审计日志、过期时间、文件类型限制和大小限制。",
      ],
    },
  ],
  featureCards: [
    { title: "Metadata in GraphQL", text: "GraphQL 管理文件 ID、名称、类型、大小和业务关联。" },
    { title: "Signed Upload URL", text: "客户端直传对象存储，服务端只签发短期凭证。" },
    { title: "Validation", text: "限制文件大小、类型、数量和归属对象。" },
    { title: "Download Authorization", text: "下载前重新校验权限，生成短期链接或鉴权重定向。" },
  ],
  examples: [
    {
      title: "请求上传凭证",
      language: "graphql",
      highlightLines: [2, 7, 8],
      code: `mutation PrepareUpload($input: PrepareUploadInput!) {
  prepareUpload(input: $input) {
    upload {
      fileId
      uploadUrl
      expiresAt
      maxBytes
      allowedContentTypes
    }
    userErrors {
      message
    }
  }
}`,
    },
    {
      title: "确认上传完成",
      language: "graphql",
      highlightLines: [1, 5],
      code: `mutation CompleteUpload($fileId: ID!, $taskId: ID!) {
  completeUpload(fileId: $fileId, taskId: $taskId) {
    attachment {
      id
      fileName
      downloadUrl
    }
    userErrors {
      message
    }
  }
}`,
    },
  ],
  review: [
    {
      question: "为什么大文件不适合直接通过 GraphQL 传输？",
      answer: "GraphQL 主要服务结构化数据，二进制流会增加服务器、网关、重试、超时和内存压力。",
    },
    {
      question: "signed URL 上传流程通常分几步？",
      answer: "先通过 GraphQL 请求上传凭证，再直传对象存储，最后通过 Mutation 确认上传并写入业务元数据。",
    },
    {
      question: "GraphQL 在文件系统中适合负责什么？",
      answer: "适合负责权限判断、签发短期凭证、记录元数据和关联业务对象。",
    },
    {
      question: "敏感文件下载为什么要使用短期链接？",
      answer: "短期链接能降低泄露后的风险，并允许服务端在生成链接前重新校验权限。",
    },
  ],
};
