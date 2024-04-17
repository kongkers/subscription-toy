// @generated
// This file was automatically generated and should not be edited.

import ApolloAPI

protocol Graphql_SelectionSet: ApolloAPI.SelectionSet & ApolloAPI.RootSelectionSet
where Schema == Graphql.SchemaMetadata {}

protocol Graphql_InlineFragment: ApolloAPI.SelectionSet & ApolloAPI.InlineFragment
where Schema == Graphql.SchemaMetadata {}

protocol Graphql_MutableSelectionSet: ApolloAPI.MutableRootSelectionSet
where Schema == Graphql.SchemaMetadata {}

protocol Graphql_MutableInlineFragment: ApolloAPI.MutableSelectionSet & ApolloAPI.InlineFragment
where Schema == Graphql.SchemaMetadata {}

extension Graphql {
  typealias ID = String

  typealias SelectionSet = Graphql_SelectionSet

  typealias InlineFragment = Graphql_InlineFragment

  typealias MutableSelectionSet = Graphql_MutableSelectionSet

  typealias MutableInlineFragment = Graphql_MutableInlineFragment

  enum SchemaMetadata: ApolloAPI.SchemaMetadata {
    static let configuration: ApolloAPI.SchemaConfiguration.Type = SchemaConfiguration.self

    static func objectType(forTypename typename: String) -> ApolloAPI.Object? {
      switch typename {
      case "Query": return Graphql.Objects.Query
      case "Membership": return Graphql.Objects.Membership
      case "Subscription": return Graphql.Objects.Subscription
      case "ChangeMessage": return Graphql.Objects.ChangeMessage
      default: return nil
      }
    }
  }

  enum Objects {}
  enum Interfaces {}
  enum Unions {}

}