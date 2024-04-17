// @generated
// This file was automatically generated and should not be edited.

@_exported import ApolloAPI

extension Graphql {
  class PointsUpdateSubscription: GraphQLSubscription {
    static let operationName: String = "PointsUpdate"
    static let operationDocument: ApolloAPI.OperationDocument = .init(
      definition: .init(
        #"subscription PointsUpdate { pointsChanged { __typename points other } }"#
      ))

    public init() {}

    struct Data: Graphql.SelectionSet {
      let __data: DataDict
      init(_dataDict: DataDict) { __data = _dataDict }

      static var __parentType: ApolloAPI.ParentType { Graphql.Objects.Subscription }
      static var __selections: [ApolloAPI.Selection] { [
        .field("pointsChanged", PointsChanged?.self),
      ] }

      var pointsChanged: PointsChanged? { __data["pointsChanged"] }

      /// PointsChanged
      ///
      /// Parent Type: `ChangeMessage`
      struct PointsChanged: Graphql.SelectionSet {
        let __data: DataDict
        init(_dataDict: DataDict) { __data = _dataDict }

        static var __parentType: ApolloAPI.ParentType { Graphql.Objects.ChangeMessage }
        static var __selections: [ApolloAPI.Selection] { [
          .field("__typename", String.self),
          .field("points", Int?.self),
          .field("other", Int?.self),
        ] }

        var points: Int? { __data["points"] }
        var other: Int? { __data["other"] }
      }
    }
  }

}