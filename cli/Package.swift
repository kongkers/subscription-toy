// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "cli",
    platforms: [.macOS(.v10_15)],
    dependencies: [
        .package(url: "https://github.com/apollographql/apollo-ios.git", from: "1.0.0"),
        .package(url: "https://github.com/apple/swift-argument-parser.git", from: "1.3.0"),
    ],
    targets: [
        .executableTarget(
            name: "client",
            dependencies: [
                .product(name: "Apollo", package: "apollo-ios"),
                .product(name: "ApolloWebSocket", package: "apollo-ios"),
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
            ]),
    ]
)
