module namefox.bookshelf.webnative {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.web;
    requires java.base;
    requires jdk.httpserver;

    opens namefox.bookshelf.webnative to javafx.fxml;
    exports namefox.bookshelf.webnative;
}