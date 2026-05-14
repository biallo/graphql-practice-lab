import type { Lesson } from "../../types";
import { fragments } from "./fragments";
import { mutations } from "./mutations";
import { queriesAndVariables } from "./queries-and-variables";
import { resolvers } from "./resolvers";
import { schemaAndTypes } from "./schema-and-types";
import { whatIsGraphql } from "./what-is-graphql";

export const lessons: Lesson[] = [
  whatIsGraphql,
  schemaAndTypes,
  queriesAndVariables,
  resolvers,
  mutations,
  fragments,
];
