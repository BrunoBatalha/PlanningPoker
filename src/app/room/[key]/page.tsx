'use client'
import { Box, useConst, useToast } from "@chakra-ui/react";
import * as realtimeDatabase from "firebase/database";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { app } from "../../../../firebase";

import {
    ConfirmChangeStoryModal,
    GameCenter,
    PlayersList,
    PointsGrid,
    StoriesSidebar,
    UserPanel
} from "@/components";

import { useGameActions } from "@/hooks/useGameActions";
import { useRoomData } from "@/hooks/useRoomData";
import { useStoryManagement } from "@/hooks/useStoryManagement";

interface ParamsUrl {
  key: string;
}

export default function Page({ params: { key: roomKey } }: { params: ParamsUrl }) {
  const POINTS = useConst(['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕']);
  const router = useRouter();
  const toast = useToast();

  // Custom hooks
  const {
    currentUser,
    pointSelected,
    setPointSelected,
    players,
    isShowAverage,
    setIsShowAverage,
    getCurrentUser
  } = useRoomData(roomKey);

  const {
    currentStory,
    pendingStories,
    scoredStories,
    addPendingStory,
    defineCurrentStory,
    saveScoredStory,
    clearCurrentStory,
    updateStoryScore
  } = useStoryManagement(roomKey);

  const {
    calculateAverage,
    savePoint,
    saveIsShowingAverage,
    resetAllUsersPoints
  } = useGameActions(roomKey, currentUser, players);

  // Local state
  const [storyInput, setStoryInput] = useState("");
  const [pendingStoryChange, setPendingStoryChange] = useState<{ key: string; name: string } | null>(null);

  // Room validation and user setup
  const existsRoomByKey = useCallback(async (currentRoomKey: string) => {
    const database = realtimeDatabase.getDatabase(app);
    const roomRef = realtimeDatabase.ref(database, `rooms/${currentRoomKey}`);
    const snapshot = await realtimeDatabase.get(roomRef);
    return snapshot.exists();
  }, []);

  useEffect(() => {
    const initialLoads = async () => {
      const existsRoom = await existsRoomByKey(roomKey);
      if (!existsRoom) {
        console.error('Room is not valid');
        router.push('/');
        return;
      }

      const user = getCurrentUser();
      if (!user) {
        console.error("User in storage is not valid");
        router.push(`/room/join/${roomKey}`);
        return;
      }
    };

    initialLoads();
  }, [roomKey, router, existsRoomByKey, getCurrentUser]);

  // Auto-save logic when cards are revealed
  useEffect(() => {
    if (isShowAverage && currentStory?.name) {
      const name = currentStory.name.trim();
      if (name) {
        const avg = calculateAverage(pointSelected);
        saveScoredStory(name, avg).catch(console.error);
      }
    }
  }, [isShowAverage, currentStory, calculateAverage, pointSelected, saveScoredStory]);

  // Auto-update scores when votes change after reveal
  useEffect(() => {
    if (isShowAverage && currentStory?.name && players.length > 0) {
      const name = currentStory.name.trim();
      if (name) {
        const avg = calculateAverage(pointSelected);
        saveScoredStory(name, avg, false).catch(console.error);
      }
    }
  }, [players, pointSelected, isShowAverage, currentStory, calculateAverage, saveScoredStory]);

  // Event handlers
  const handleSelectPoint = async (point: string) => {
    try {
      setPointSelected(point);
      await savePoint(point);
    } catch (error) {
      setPointSelected(null);
    }
  };

  const handleUndoPoint = async () => {
    try {
      setPointSelected(null);
      await savePoint(null);
    } catch (error) {
      console.error('Error undoing point:', error);
    }
  };

  const handleRevealCards = async () => {
    await saveIsShowingAverage(true);
  };

  const handleNewRound = async () => {
    await resetAllUsersPoints();
    await saveIsShowingAverage(false);
    
    if (currentStory?.name) {
      await clearCurrentStory();
    }
  };

  const handleSelectPendingAsCurrent = (story: { key: string; name: string }) => {
    if (isShowAverage && currentStory?.name && currentStory.name !== story.name) {
      setPendingStoryChange(story);
    } else {
      defineCurrentStory(story.name);
    }
  };

  const handleAddStory = async (name: string) => {
    await addPendingStory(name);
    await defineCurrentStory(name);
    setStoryInput("");
  };

  const confirmStoryChange = async () => {
    if (!pendingStoryChange || !currentStory?.name) return;

    try {
      // Save current story with current average
      const currentName = currentStory.name.trim();
      if (currentName) {
        const avg = calculateAverage(pointSelected);
        await saveScoredStory(currentName, avg, true);
      }

      // Start new round
      await resetAllUsersPoints();
      await saveIsShowingAverage(false);
      await defineCurrentStory(pendingStoryChange.name);

      setPendingStoryChange(null);

      toast({
        title: '🔄 Estória alterada!',
        description: `Nova rodada iniciada para "${pendingStoryChange.name}"`,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      console.error('Error changing story:', error);
      toast({
        title: 'Erro ao trocar estória',
        description: 'Tente novamente em alguns segundos',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const cancelStoryChange = () => {
    setPendingStoryChange(null);
  };

  return (
    <Box h='100vh' py='12' overflow='hidden' position='relative'>
      {/* Confirm Change Story Modal */}
      {pendingStoryChange && currentStory && (
        <ConfirmChangeStoryModal
          isOpen={!!pendingStoryChange}
          onClose={cancelStoryChange}
          onConfirm={confirmStoryChange}
          currentStoryName={currentStory.name}
          newStoryName={pendingStoryChange.name}
          currentAverage={calculateAverage(pointSelected)}
        />
      )}

      {/* Stories Sidebar */}
      <StoriesSidebar
        pendingStories={pendingStories}
        scoredStories={scoredStories}
        storyInput={storyInput}
        onStoryInputChange={setStoryInput}
        onAddStory={handleAddStory}
        onSelectPendingStory={handleSelectPendingAsCurrent}
        onUpdateStoryScore={updateStoryScore}
        currentStory={currentStory}
      />

      {/* User Panel */}
      <UserPanel 
        currentUser={currentUser}
        onNewRoom={() => router.push('/')}
      />

      {/* Points Grid */}
      <PointsGrid
        points={POINTS}
        pointSelected={pointSelected}
        onSelectPoint={handleSelectPoint}
        onUndoPoint={handleUndoPoint}
      />

      {/* Game Area */}
      <Box h='80%' mx='12' display='flex'>
        <PlayersList 
          players={players} 
          isShowAverage={isShowAverage} 
          position='left' 
        />
        
        <GameCenter
          currentStory={currentStory}
          isShowAverage={isShowAverage}
          average={calculateAverage(pointSelected)}
          onRevealCards={handleRevealCards}
          onNewRound={handleNewRound}
        />
        
        <PlayersList 
          players={players} 
          isShowAverage={isShowAverage} 
          position='right' 
        />
      </Box>
    </Box>
  );
}

