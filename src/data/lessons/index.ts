import { authAndPermissions } from "./auth-and-permissions";
import { clientCache } from "./client-cache";
import { errorsAndPartialResponses } from "./errors-and-partial-responses";
import { fileUploadDownload } from "./file-upload-download";
import type { Lesson } from "../../types";
import { fragments } from "./fragments";
import { interfacesAndUnions } from "./interfaces-and-unions";
import { mutations } from "./mutations";
import { nPlusOneDataloader } from "./n-plus-one-dataloader";
import { observability } from "./observability";
import { paginationConnections } from "./pagination-connections";
import { productionChecklist } from "./production-checklist";
import { practicalApiDesign } from "./practical-api-design";
import { queriesAndVariables } from "./queries-and-variables";
import { queryComplexitySecurity } from "./query-complexity-security";
import { restMigration } from "./rest-migration";
import { resolvers } from "./resolvers";
import { schemaAndTypes } from "./schema-and-types";
import { schemaEvolution } from "./schema-evolution";
import { subscriptions } from "./subscriptions";
import { testingGraphqlApi } from "./testing-graphql-api";
import { toolingAndCodegen } from "./tooling-and-codegen";
import { whatIsGraphql } from "./what-is-graphql";

export const lessons: Lesson[] = [
  whatIsGraphql,
  schemaAndTypes,
  queriesAndVariables,
  resolvers,
  mutations,
  fragments,
  interfacesAndUnions,
  paginationConnections,
  errorsAndPartialResponses,
  authAndPermissions,
  nPlusOneDataloader,
  queryComplexitySecurity,
  subscriptions,
  clientCache,
  schemaEvolution,
  practicalApiDesign,
  toolingAndCodegen,
  testingGraphqlApi,
  observability,
  fileUploadDownload,
  restMigration,
  productionChecklist,
];
