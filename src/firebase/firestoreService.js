import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config';

export function colRef(name) {
  return collection(db, name);
}

export function orderedQuery(name, field = 'order') {
  return query(colRef(name), orderBy(field, 'asc'));
}

export async function addItem(name, data, order = 0) {
  return addDoc(colRef(name), { ...data, order, createdAt: serverTimestamp() });
}

export async function updateItem(name, id, data) {
  return updateDoc(doc(db, name, id), data);
}

export async function deleteItem(name, id) {
  return deleteDoc(doc(db, name, id));
}
