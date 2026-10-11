export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const SitePartsFragmentDoc = gql`
    fragment SiteParts on Site {
  __typename
  name
  title
  description
  email
  socials {
    __typename
    label
    href
  }
  nav {
    __typename
    label
    href
  }
  about {
    __typename
    headline
    body
    extended
  }
  hero {
    __typename
    intro
  }
}
    `;
export const CaseStudyPartsFragmentDoc = gql`
    fragment CaseStudyParts on CaseStudy {
  __typename
  slug
  title
  category
  summary
  role
  duration
  team
  tools
  cover {
    __typename
    src
    alt
    aspectRatio
  }
  featured
  brand
  stats {
    __typename
    value
    label
  }
  sections {
    __typename
    id
    title
    blocks {
      __typename
      type
      content
      text
      attribution
      src
      alt
      aspectRatio
      items {
        __typename
        value
        label
      }
    }
  }
}
    `;
export const SiteDocument = gql`
    query site($relativePath: String!) {
  site(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SiteParts
  }
}
    ${SitePartsFragmentDoc}`;
export const SiteConnectionDocument = gql`
    query siteConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SiteFilter) {
  siteConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SiteParts
      }
    }
  }
}
    ${SitePartsFragmentDoc}`;
export const CaseStudyDocument = gql`
    query caseStudy($relativePath: String!) {
  caseStudy(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...CaseStudyParts
  }
}
    ${CaseStudyPartsFragmentDoc}`;
export const CaseStudyConnectionDocument = gql`
    query caseStudyConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: CaseStudyFilter) {
  caseStudyConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...CaseStudyParts
      }
    }
  }
}
    ${CaseStudyPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    site(variables, options) {
      return requester(SiteDocument, variables, options);
    },
    siteConnection(variables, options) {
      return requester(SiteConnectionDocument, variables, options);
    },
    caseStudy(variables, options) {
      return requester(CaseStudyDocument, variables, options);
    },
    caseStudyConnection(variables, options) {
      return requester(CaseStudyConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
