export const customerDeleteMutation = `#graphql
  mutation customerDelete($id: ID!) {
    customerDelete(input: {id: $id}) {
        shop {
        id
        }
        userErrors {
        field
        message
        }
        deletedCustomerId
    }
}
`