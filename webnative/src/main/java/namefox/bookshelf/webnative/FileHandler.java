package namefox.bookshelf.webnative;

import com.sun.net.httpserver.*;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;

public class FileHandler implements HttpHandler {

    private File file;
    private String mimeType;
    
    public FileHandler(String file) throws IOException {
        this.file = new File(file);

        this.mimeType = Files.probeContentType(Paths.get(file));
        if (this.mimeType == null) this.mimeType = "application/octet-stream";
    }

    @Override
    public void handle(HttpExchange he) throws IOException {
        OutputStream os = he.getResponseBody();

        he.getResponseHeaders().put("Content-Type", Collections.singletonList(mimeType));
        he.sendResponseHeaders(200, file.length());

        OutputStream outputStream = he.getResponseBody();
        Files.copy(file.toPath(), outputStream);
        outputStream.close();

        os.close();
    }
}