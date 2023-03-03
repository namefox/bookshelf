package namefox.bookshelf.webnative;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.File;
import java.net.*;
import com.sun.net.httpserver.*;

import java.io.IOException;

public class Bookshelf extends Application {

    private static HttpServer server;

    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(Bookshelf.class.getResource("hello-view.fxml"));
        fxmlLoader.setController(new BookshelfController(stage));

        Scene scene = new Scene(fxmlLoader.load(), 320, 240);
        stage.setMinWidth(1240.0);
        stage.setMinHeight(720.0);
        stage.setScene(scene);
        stage.setOnHidden(e -> server.stop(0));
        stage.show();
    }

    public static void main(String[] args) throws Exception {
        server = HttpServer.create(new InetSocketAddress(5500), 0);
        server.createContext("/", new FileHandler("../index.html"));
        server.setExecutor(null); // creates a default executor

        createContexts(server, new File("../").listFiles(), "/");

        server.start();
        launch();
    }

    private static void createContexts(HttpServer server, File[] files, String dir) throws IOException {
        if (files == null) return;

        for (File file:
             files) {
            if (file.isHidden()) continue;

            if (file.isDirectory()) {
                createContexts(server, file.listFiles(), dir + file.getName() + "/");
                System.out.println("Added Directory Context: " + file.getName() + " (" + dir + file.getName() + ")");

                continue;
            }

            server.createContext(dir + file.getName(), new FileHandler(file.getAbsolutePath()));
            System.out.println("Added File Context: " + file.getName() + " (" + dir + file.getName() + ")");
        }
    }
}