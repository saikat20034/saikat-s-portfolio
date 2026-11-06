import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { orderedQuery } from './firestoreService';
import { isFirebaseConfigured } from './config';

/**
 * Subscribes in real time to a Firestore collection (ordered by `order`).
 * Falls back to `fallbackData` while loading, if the collection is empty,
 * or if Firebase hasn't been configured yet — so the public site never
 * looks blank before the admin has added content / set up Firebase.
 */
export function useLiveCollection(collectionName, fallbackData = []) {
  const [items, setItems] = useState(fallbackData);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setItems(fallbackData);
      setUsingFallback(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      orderedQuery(collectionName),
      (snapshot) => {
        if (snapshot.empty) {
          setItems(fallbackData);
          setUsingFallback(true);
        } else {
          setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          setUsingFallback(false);
        }
        setLoading(false);
      },
      () => {
        // Firestore unreachable / rules block read — stay on fallback
        setItems(fallbackData);
        setUsingFallback(true);
        setLoading(false);
      }
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { items, loading, usingFallback };
}
