package ru.cherkovskiy;


import ratpack.server.BaseDir;
import ratpack.server.RatpackServer;
import ratpack.server.ServerConfig;

import java.net.InetAddress;

public class CalculatorLoader {
    public static void main(String[] args) throws Exception {
        RatpackServer.start(server ->
                server
                        .serverConfig(ServerConfig.builder()
                                .baseDir(BaseDir.find("index.html"))
                                .address(InetAddress.getLoopbackAddress())
                                .port(8888)
                                .args(args)
                                .build())
                        .handlers(chain -> chain
                                .files(c -> c.indexFiles("index.html")))
        );
    }
}
