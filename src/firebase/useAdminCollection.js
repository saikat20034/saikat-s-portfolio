import { useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { orderedQuery } from './firestoreService';
import { isFirebaseConfigured } from './config';

/** Live-subscribes to the raw Firestore collection — used in the admin panel,
 * where we want to see actual DB contents (including "empty"), not a fallback. */
export function useAdminCollection(collectionName) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState(
    isFirebaseConfigured ? null : 'Firebase is not configured yet — see README.md.'
  );

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      orderedQuery(collectionName),
      (snapshot) => {
        setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { items, loading, error };
}
