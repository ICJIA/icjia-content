import gql from "graphql-tag";

const GET_CONTENT_QUERY = gql`
  query content {
    posts(sort: "updated_at:desc") {
      id
      title
      slug
      created_at
      updated_at
      published_at
    }
    pages(sort: "updated_at:desc") {
      id
      title
      slug
      category
      summary
      created_at
      updated_at
      published_at
    }
    biographies(sort: "updated_at:desc") {
      id
      slug
      affiliation
      title: fullName
      created_at
      updated_at
      published_at
    }
    jobs(sort: "updated_at:desc") {
      id
      slug
      title
      created_at
      updated_at
      published_at
    }
    meetings(sort: "updated_at:desc") {
      id
      slug
      title
      created_at
      updated_at
      published_at
    }
    programs(sort: "updated_at:desc") {
      id
      slug
      title
      created_at
      updated_at
      published_at
    }
    events(sort: "updated_at:desc") {
      id
      slug
      title: name
      created_at
      updated_at
      published_at
    }
    grants(sort: "updated_at:desc") {
      id
      slug
      created_at
      title
      updated_at
      published_at
    }
    units(sort: "updated_at:desc") {
      id
      slug
      title
      created_at
      updated_at
      published_at
    }
  }
`;

export { GET_CONTENT_QUERY };
