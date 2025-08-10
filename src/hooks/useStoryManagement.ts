import { useToast } from "@chakra-ui/react";
import * as realtimeDatabase from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { app } from "../../firebase";

interface StoryPending { 
  name: string;
  key: string;
}

interface StoryScored { 
  name: string; 
  average: string;
  key: string;
}

interface CurrentStory {
  name: string;
}

export function useStoryManagement(roomKey: string) {
  const [currentStory, setCurrentStory] = useState<CurrentStory | null>(null);
  const [pendingStories, setPendingStories] = useState<StoryPending[]>([]);
  const [scoredStories, setScoredStories] = useState<StoryScored[]>([]);
  const toast = useToast();

  // Firebase listeners
  useEffect(() => {
    const database = realtimeDatabase.getDatabase(app);
    
    // Listen to current story
    const currentStoryRef = realtimeDatabase.ref(database, `rooms/${roomKey}/currentStory`);
    const unsubscribeCurrentStory = realtimeDatabase.onValue(currentStoryRef, (snapshot: realtimeDatabase.DataSnapshot) => {
      const data = snapshot.val();
      setCurrentStory(data ?? null);
    });

    // Listen to pending stories
    const pendingRef = realtimeDatabase.ref(database, `rooms/${roomKey}/pendingStories`);
    const unsubscribePending = realtimeDatabase.onValue(pendingRef, (snapshot: realtimeDatabase.DataSnapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data as Record<string, { name: string }>).map(([key, value]) => ({ 
        key, 
        name: value.name 
      }));
      setPendingStories(list);
    });

    // Listen to scored stories
    const scoredRef = realtimeDatabase.ref(database, `rooms/${roomKey}/stories`);
    const unsubscribeScored = realtimeDatabase.onValue(scoredRef, (snapshot: realtimeDatabase.DataSnapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data as Record<string, { name: string; average: string }>).map(([key, value]) => ({ 
        key, 
        name: value.name,
        average: value.average
      }));
      setScoredStories(list);
    });

    return () => {
      unsubscribeCurrentStory();
      unsubscribePending();
      unsubscribeScored();
    };
  }, [roomKey]);

  const addPendingStory = useCallback(async (name: string) => {
    const database = realtimeDatabase.getDatabase(app);
    const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/pendingStories`);
    await realtimeDatabase.push(ref, { name });
  }, [roomKey]);

  const defineCurrentStory = useCallback(async (name: string) => {
    const database = realtimeDatabase.getDatabase(app);
    const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/currentStory`);
    await realtimeDatabase.set(ref, { name });
  }, [roomKey]);

  const saveScoredStory = useCallback(async (name: string, average: string, showToast: boolean = true) => {
    const database = realtimeDatabase.getDatabase(app);
    
    // Check if story already exists in scored stories and update it
    const existingStory = scoredStories.find((s) => s.name === name);
    if (existingStory) {
      const scoredRef = realtimeDatabase.ref(database, `rooms/${roomKey}/stories/${existingStory.key}`);
      await realtimeDatabase.update(scoredRef, { average });
    } else {
      const scoredRef = realtimeDatabase.ref(database, `rooms/${roomKey}/stories`);
      await realtimeDatabase.push(scoredRef, { name, average });
    }

    if (showToast) {
      toast({
        title: '📊 Pontuação salva!',
        description: `"${name}" pontuada com ${average}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }

    // Remove from pending if exists (only for new stories)
    if (!existingStory) {
      const matched = pendingStories.find((s) => s.name === name);
      if (matched) {
        const pendingRef = realtimeDatabase.ref(database, `rooms/${roomKey}/pendingStories/${matched.key}`);
        await realtimeDatabase.remove(pendingRef);
      }
    }
  }, [roomKey, scoredStories, pendingStories, toast]);

  const clearCurrentStory = useCallback(async () => {
    const database = realtimeDatabase.getDatabase(app);
    const currentRef = realtimeDatabase.ref(database, `rooms/${roomKey}/currentStory`);
    await realtimeDatabase.remove(currentRef);
  }, [roomKey]);

  const updateStoryScore = useCallback(async (storyKey: string, newAverage: string) => {
    const database = realtimeDatabase.getDatabase(app);
    const scoredRef = realtimeDatabase.ref(database, `rooms/${roomKey}/stories/${storyKey}`);
    await realtimeDatabase.update(scoredRef, { average: newAverage });
    
    toast({
      title: '✏️ Pontuação editada!',
      description: `Nova pontuação: ${newAverage}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  }, [roomKey, toast]);

  return {
    currentStory,
    pendingStories,
    scoredStories,
    addPendingStory,
    defineCurrentStory,
    saveScoredStory,
    clearCurrentStory,
    updateStoryScore
  };
}
