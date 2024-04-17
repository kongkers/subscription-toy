// A commandline interface to the subscriptions-toy graphql server
// for macOS

import Foundation
import Apollo
import ArgumentParser
import Combine
import ApolloWebSocket

// one issue with using swift argument parser is that the command protocol
// doesn't allow us to store references in fields on the command so we
// workaround that by storing global references we need to keep alive here
private var _apollo: ApolloClient?
private var bag = Set<AnyCancellable>()

private func createClient(target: String,
                          useWebsockets: Bool = false) throws -> ApolloClient {
    guard let url = URL(string: target) else { throw URLError(.badURL) }

    if useWebsockets {
        let store = ApolloStore()

        let webSocketTransport: WebSocketTransport = {
            let webSocketClient = WebSocket(url: url, protocol: .graphql_transport_ws)
            return WebSocketTransport(websocket: webSocketClient)
        }()

        let httpTransport: RequestChainNetworkTransport = {
            return RequestChainNetworkTransport(interceptorProvider: DefaultInterceptorProvider(store: store), endpointURL: url)
        }()

        let splitNetworkTransport = SplitNetworkTransport(
            uploadingNetworkTransport: httpTransport,
            webSocketNetworkTransport: webSocketTransport
        )

        let client = ApolloClient(networkTransport: splitNetworkTransport, store: store)

        _apollo = client
        return client
    } else {
        let client = ApolloClient(url: url)
        _apollo = client
        return client
    }
}

// Apollo cancellables aren't real cancellables! we make an adapter

class ApolloBox: Combine.Cancellable {
    private let target: Apollo.Cancellable
    init(_ target: Apollo.Cancellable) { self.target = target }
    func cancel() { target.cancel() }
}

extension Apollo.Cancellable {
    var cancellable: Combine.Cancellable { ApolloBox(self) }
}

private func dumpError(error: GraphQLError) {
    print(error)
    (error.extensions?["stacktrace"] as? [String])
        .flatMap({ print($0.joined(separator: "\n")) })
}

enum Failure: Error {
    case invalidResponse
}

/// set special environment variables to trigger apple network tracing
func enableNetworkTrace() {
    setenv("CFNETWORK_DIAGNOSTICS", "3", 1)
    setenv("CFLOG_FORCE_STDERR", "1", 1)
}

extension ParsableCommand {
    /// setup a runloop and run the provided block on main
    func dispatchAsync(_ block: @escaping () throws -> Void) {
        DispatchQueue.main.async {
            do { try block()
            } catch { Self.exit(withError: error) }
        }
        RunLoop.main.run()
    }
}

struct Options: ParsableArguments {
    @Option var target: String = "http://localhost:4000"
    @Flag var trace: Bool = false
}

/// Issue a GraphQL query for points, output them and exit
struct GetPoints: ParsableCommand {
    static let configuration = CommandConfiguration(commandName: "get")

    @OptionGroup var options: Options

    mutating func run() throws {
        if options.trace { enableNetworkTrace() }

        let apollo = try createClient(target: options.target)

        dispatchAsync {
            apollo.fetch(query: Graphql.GetPointsQuery()) { result in
                switch result {
                case let .success(data):
                    guard let membership = data.data?.membership
                    else { Self.exit(withError: Failure.invalidResponse) }
                    print("points:", membership.points)
                    Self.exit()
                case let .failure(error):
                    Self.exit(withError: error)
                }
            }
        }
    }
}

/// Create a GraphQL subscription for points and output updates indefinately
struct WatchPoints: ParsableCommand {
    static let configuration = CommandConfiguration(commandName: "watch")

    @OptionGroup var options: Options
    @Flag var useWebsockets: Bool = false

    mutating func run() throws {
        if options.trace { enableNetworkTrace() }

        let apollo = try createClient(target: options.target,
                                      useWebsockets: useWebsockets)

        dispatchAsync {
            apollo.subscribe(subscription: Graphql.PointsUpdateSubscription()) { result in
                switch result {
                case let .success(data):
                    for error in (data.errors ?? []) {
                        dumpError(error: error)
                    }

                    guard let points = data.data?.pointsChanged
                    else {
                        fputs("response received with no error but also no data!\n", stderr)
                        return
                    }
                    print("points now:", points.points!)
                case let .failure(error):
                    print("failed:", error)
                    Self.exit(withError: error)
                }
            }
            .cancellable.store(in: &bag)
        }
    }
}

@main
private struct ApolloToyCommand: ParsableCommand {
    static let configuration = CommandConfiguration(
        abstract: "Command line interface to toy apollo server",
        subcommands: [GetPoints.self, WatchPoints.self]
    )
}
