package namefox.bookshelf.webnative;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

import java.net.URL;
import java.util.ResourceBundle;

public class BookshelfController implements Initializable {
    @FXML
    private WebView webView;

    private Stage stage;

    public BookshelfController(Stage stage) {
        this.stage = stage;
    }

    @Override
    @FXML
    public void initialize(URL url, ResourceBundle resourceBundle) {
        webView.getEngine().load("http://127.0.0.1:5500/");

        stage.setTitle(webView.getEngine().getTitle());
    }
}