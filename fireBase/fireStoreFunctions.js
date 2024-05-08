import { db } from "./Config";
import {
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
// Get a list of books from your database
async function getbooks() {
  const books = collection(db, "books");
  const booksnapshot = await getDocs(books);
  const bookList = booksnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return bookList;
}

async function editbook(book) {
  console.log("at editbook", book);
  await setDoc(doc(db, "books", book.id), book);
}

async function deletebook(id) {
  try {
    await deleteDoc(doc(db, "books", id));
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}

async function addbook(book) {
  try {
    const docRef = await addDoc(collection(db, "books"), book);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function subscribe(callback) {
  const unsubscribe = onSnapshot(
    query(collection(db, "books")),
    (snapshot) => {
      const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
      snapshot.docChanges().forEach((change) => {
        // console.log("changes", change, snapshot.metadata);
        if (callback) callback({ change, snapshot });
      });
      // console.log(source, " data: ", snapshot.data());
    }
  );
  return unsubscribe;
}

export { getbooks, addbook, editbook, deletebook, subscribe };
