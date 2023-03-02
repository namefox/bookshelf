let books = [];
let selectedBook;
let newBookShelfNumber = -1;

let saved = localStorage.getItem("books");
if (saved)
    books = JSON.parse(saved);
else
    localStorage.setItem("books", JSON.stringify(books));

const rgb = (color) => {
    return new Promise(resolve => {
fetch("./assets/colors.json").then(response => response.json()).then((colors) => {
    if (typeof colors[color.toLowerCase()] != 'undefined')
        resolve(hexToRgb(colors[color.toLowerCase()]));
        
    if (color.startsWith("#") && (color.length == 3 || color.length == 6))
        resolve(hexToRgb(color));

    resolve();
});
    });
};

const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const createBookPanel = (colorStyleChange, book, index) => {
    const div = document.createElement("div");
    div.id = book.title;
    div.style.background = book.color;
    div.classList.add("book");

    div.setAttribute("index", index);
    div.setAttribute("shelf", book.shelfNumber);

    const img = document.createElement("img");
    img.src = "assets/book-stripes.png";
    div.appendChild(img);

    const bookTitle = document.createElement("p");
    bookTitle.style.color = colorStyleChange;
    bookTitle.classList.add("bookTitle");
    bookTitle.innerText = book.title;
    div.append(bookTitle);

    const bookAuthors = document.createElement("p");
    bookAuthors.style.color = colorStyleChange;
    bookAuthors.classList.add("authors");
    bookAuthors.innerText = book.authors.toString().replaceAll(",", ", ");
    div.append(bookAuthors);

    div.addEventListener("click", () => {
        console.log(`[${book.title}] Clicked: show panel`);
        showPanel(book, div);
    });

    return div;
};

const showPanel = (book, div) => {
    selectedBook = book;

    const panel = document.querySelector(".panel#main");
    panel.classList.toggle("visible");

    if (book == null || div == null) return;

    bookName.innerText = book.title;
    bookAuthors.innerText = "By " + book.authors.toString().replaceAll(",", ", ");
    bookCape.src = book.image;
    bookSelect.value = book.shelfNumber;
};

const showNewBookPanel = (shelf) => {
    newBookShelfNumber = -1;

    const panel = document.querySelector(".panel#newBook");
    panel.classList.toggle("visible");

    if (shelf < 0) return;
    newBookShelfNumber = shelf;
};

const clearShelf = shelf => {
    shelf.childNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.getAttribute("special") != null) return;
        node.remove();
    })
};

const updateBooks = () => {
    localStorage.setItem("books", JSON.stringify(books));
    const allShelves = document.querySelectorAll(".shelf");
    allShelves.forEach(e => clearShelf(e));

    books.forEach((book) => {
        rgb(book.color).then((color) => {
            let colorStyleChange = "";
            if (color.r >= 128 && color.g >= 128 && color.b >= 128) {
                colorStyleChange = "black";
                console.log(`[${book.title}] Color is light`);
            }
        
            if (book.shelfNumber < 0 || book.shelfNumber > 2) {
                allShelves.forEach((shelf) => {
                    shelf.appendChild(createBookPanel(colorStyleChange, book));
                });
                console.log(`[${book.title}] Added to all shelves`);
            } else {
                allShelves[book.shelfNumber].appendChild(createBookPanel(colorStyleChange, book));
                console.log(`[${book.title}] Added to shelf ${book.shelfNumber}`);
            }
        });
    });
};

bookClose.addEventListener("click", () => {
    updateBooks();
    showPanel(undefined, undefined);
});

bookSelect.addEventListener("change", () => selectedBook.shelfNumber = bookSelect.value);

bookRemove.addEventListener("click", () => {
    const index = books.indexOf(selectedBook);
    if (index > -1) {
        books.splice(index, 1);
    }

    updateBooks();
    showPanel(undefined, undefined);
});

addNewBook.addEventListener("submit", e => {
    e.preventDefault();

    const title = addNewBook.querySelector("[name=title]").value;
    const authors = addNewBook.querySelector("[name=authors]").value;
    const categories = addNewBook.querySelector("[name=categories]").value;
    const image = addNewBook.querySelector("[name=image]").value;
    const color = addNewBook.querySelector("[name=color]").value;

    if (!title || !authors) return;
    console.log("[Bookshelf] Adding new book: " + title);

    const object = {
        title: title,
        authors: authors.split(", "),
        categories: categories.split(", "),
        image: image,
        color: color,
        shelfNumber: newBookShelfNumber
    };

    books.push(object);

    showNewBookPanel(-1);
    updateBooks();
});

const newBooks = document.querySelectorAll(".book.newBook");
newBooks.forEach((newBook) => {
    newBook.addEventListener("click", () => {
        showNewBookPanel(parseInt(newBook.getAttribute("shelf")));
    });
});

newBookClose.addEventListener("click", () => showNewBookPanel(-1));

updateBooks();