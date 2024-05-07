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
// Get a list of cities from your database
async function getProducts() {
  const products = collection(db, "products");
  const productSnapshot = await getDocs(products);
  const productList = productSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return productList;
}

async function editCity(city) {
  console.log("at editCity", city);
  await setDoc(doc(db, "cities", city.id), city);
}

async function deleteCity(id) {
  try {
    await deleteDoc(doc(db, "cities", id));
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}

async function addProduct(product) {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function subscribe(callback) {
  const unsubscribe = onSnapshot(
    query(collection(db, "cities")),
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

export { getProducts, addProduct, editCity, deleteCity, subscribe };
