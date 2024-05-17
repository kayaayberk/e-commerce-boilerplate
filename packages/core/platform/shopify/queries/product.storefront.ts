import { collectionFragment } from '../fragments/collection'
import { productFragment } from '../fragments/product'

export const getProductQuery = `#graphql
  query SingleProduct($id: ID!) {
    product(id: $id) {
      ...singleProduct
    }
  }
  ${productFragment}
`

export const getProductsByHandleQuery = `#graphql
  query ProductsByHandle($query: String!) {
    products(first: 1, query: $query) {
      edges {
        node {
          ...singleProduct
        }
      }
    }
  }
  ${productFragment}
`

export const getProductsQuery = `#graphql
  query Products($sortKey: ProductSortKeys, $reverse: Boolean, $query: String, $numProducts: Int!, $cursor: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: $numProducts, after: $cursor ) {
      edges {
        node {
          ...singleProduct
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${productFragment}
`

export const getProductRecommendationsQuery = `#graphql
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...singleProduct
    }
  }
  ${productFragment}
`

export const searchProductsQuery = `#graphql
  query SearchProducts($query: String!, $first: Int) {
    search(query: $query, first: $first) {
      edges {
        node {
          ...singleProduct
        }
      }
    }
  }
  ${productFragment}
`

export const predictiveSearchQuery = `#graphql
  query PredictiveSearch($query: String!, $limit: Int, $limitScope: PredictiveSearchLimitScope) {
    predictiveSearch(query: $query, limit: $limit, limitScope: $limitScope) {
      queries {
        text
        styledText
        trackingParameters
      }
      collections {
        id
      }
      products {
        ...singleProduct
      }
      pages {
        id
        title
        handle
        body
        bodySummary
        seo {
          ...seo
        }
        createdAt
        updatedAt
      }
    }
  }
  ${productFragment}

`
