// @generated
// This file was automatically generated and should not be edited.

@_exported import ApolloAPI

extension Graphql {
  class GetPointsQuery: GraphQLQuery {
    static let operationName: String = "GetPoints"
    static let operationDocument: ApolloAPI.OperationDocument = .init(
      definition: .init(
        #"query GetPoints { membership { __typename points } }"#
      ))

    public init() {}

    struct Data: Graphql.SelectionSet {
      let __data: DataDict
      init(_dataDict: DataDict) { __data = _dataDict }

      static var __parentType: ApolloAPI.ParentType { Graphql.Objects.Query }
      static var __selections: [ApolloAPI.Selection] { [
        .field("membership", Membership.self),
      ] }

      var membership: Membership { __data["membership"] }

      /// Membership
      ///
      /// Parent Type: `Membership`
      struct Membership: Graphql.SelectionSet {
        let __data: DataDict
        init(_dataDict: DataDict) { __data = _dataDict }

        static var __parentType: ApolloAPI.ParentType { Graphql.Objects.Membership }
        static var __selections: [ApolloAPI.Selection] { [
          .field("__typename", String.self),
          .field("points", Int.self),
        ] }

        var points: Int { __data["points"] }
      }
    }
  }

}