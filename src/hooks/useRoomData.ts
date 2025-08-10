import * as realtimeDatabase from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { app } from "../../firebase";

interface User {
  username: string;
  point: string | null;
  key?: string;
}

interface CurrentUser {
  username: string;
  key: string;
}

export function useRoomData(roomKey: string) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [pointSelected, setPointSelected] = useState<string | null>(null);
  const [players, setPlayers] = useState<User[]>([]);
  const [isShowAverage, setIsShowAverage] = useState(false);

  const getCurrentUser = useCallback(() => {
    const storageUser = window.sessionStorage.getItem('currentUser');
    const currentUser = JSON.parse(storageUser ?? '{}') as CurrentUser;
    if (!storageUser || !currentUser.key || !currentUser.username) {
      return null;
    }
    return currentUser;
  }, []);

  const onListPlayers = useCallback((currentUserKey: string) => {
    const database = realtimeDatabase.getDatabase(app);
    const usersRef = realtimeDatabase.ref(database, `rooms/${roomKey}/users`);
    
    return realtimeDatabase.onValue(usersRef, (snapshot: realtimeDatabase.DataSnapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const data = snapshot.val();
      setPointSelected(data[currentUserKey].point);
      delete data[currentUserKey];
      const keyValue = Object.entries(data) as [string, User][];
      const userList = keyValue.map(([key, value]) => ({ key, ...value }));
      setPlayers(userList.map(u => ({ username: u.username, point: u.point, key: u.key })));
    });
  }, [roomKey]);

  const onShowAverage = useCallback(() => {
    const database = realtimeDatabase.getDatabase(app);
    const usersRef = realtimeDatabase.ref(database, `rooms/${roomKey}`);
    
    return realtimeDatabase.onValue(usersRef, (snapshot: realtimeDatabase.DataSnapshot) => {
      const data = snapshot.val();
      setIsShowAverage(!!data.isShowingAverage);
    });
  }, [roomKey]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [getCurrentUser]);

  useEffect(() => {
    if (currentUser?.key) {
      const unsubscribe = onListPlayers(currentUser.key);
      return () => unsubscribe();
    }
  }, [currentUser, onListPlayers]);

  useEffect(() => {
    const unsubscribe = onShowAverage();
    return () => unsubscribe();
  }, [onShowAverage]);

  return {
    currentUser,
    setCurrentUser,
    pointSelected,
    setPointSelected,
    players,
    isShowAverage,
    setIsShowAverage,
    getCurrentUser
  };
}
