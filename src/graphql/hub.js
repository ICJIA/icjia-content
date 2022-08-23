/* Querying different GraphQL server -- no way for multiple schemas. */
/* See: https://github.com/apollographql/apollo-tooling/issues/1535 */

import gql from "graphql-tag";
const ignoredGqlTag = gql;

const GET_ALL_HUB_QUERY = ignoredGqlTag`
  query apps {
    apps(where: { status: "published" }) {
      id
      title
      slug
      updatedAt
      
    }
    articles(where: { status: "published" }) {
      id
      title
      slug
      updatedAt
      
    }
     datasets(where: { status: "published" }) {
      id
      title
      slug
      updatedAt
      
    }
    
  }
`;

export { GET_ALL_HUB_QUERY };
