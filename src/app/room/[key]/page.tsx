'use client'
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import * as realtimeDatabase from "firebase/database";
import { Avatar, Box, Button, Flex, Heading, Tag, TagLeftIcon, Text, Wrap, WrapItem, useClipboard, useConst, useToast, Input, InputGroup, InputRightElement, IconButton, VStack, Divider, Badge } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { app } from "../../../../firebase";
import { useRouter } from "next/navigation";
import { AddIcon, LinkIcon } from "@chakra-ui/icons";
import { CardOtherPlayer, CardPoint, EffectDisable, StoriesSidebar } from "@/components";
/**
 *
rooms
    id	-> unique value to share with players		
        isShowingAverage: boolean
        stories []
            id
                name: string
                average: string
        users []
            id
                username: string
                point: string
 */

interface User {
    username: string,
    point: string | null
    key?: string
}

interface CurrentUser {
    username: string,
    key: string
}

interface ParamsUrl {
    key: string
}

interface StoryPending { name: string }
interface StoryScored { name: string; average: string }

export default function Page({ params: { key: roomKey } }: { params: ParamsUrl }) {
    const POINTS = useConst(['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕'])
    const router = useRouter()
    const toast = useToast()
    const { setValue: setValueToClipboard, onCopy } = useClipboard('')
    const [currentUser, setCurrentUser] = useState<CurrentUser>()
    const [pointSelected, setPointSelected] = useState<string | null>(null)
    const [players, setPlayers] = useState<User[]>([])
    const [isShowAverage, setIsShowAverage] = useState(false)
    const [currentStory, setCurrentStory] = useState<{ name: string } | null>(null)
    const [storyInput, setStoryInput] = useState("")
    const [pendingStories, setPendingStories] = useState<Array<{ key: string } & StoryPending>>([])
    const [scoredStories, setScoredStories] = useState<Array<{ key: string } & StoryScored>>([])

    const leftCardPlayerList = useMemo(() => {
        const playersLeft = players.length > 1 ? players.slice(0, players.length / 2) : players
        return playersLeft.map((p: User, index: number) => (
            <CardOtherPlayer
                key={index}
                point={p.point}
                username={p.username}
                showPoint={isShowAverage}
            />
        ))
    }, [players, isShowAverage])

    const rigthCardPlayerList = useMemo(() => {
        const playersRight = players.length > 1 ? players.slice(players.length / 2, players.length) : []
        return playersRight.map((p: User, index: number) => (
            <CardOtherPlayer
                key={index}
                point={p.point}
                username={p.username}
                showPoint={isShowAverage}
            />
        ))
    }, [players, isShowAverage])

    const onListPlayers = useCallback((currentUserKey: string) => {
        const database = realtimeDatabase.getDatabase(app)
        const usersRef = realtimeDatabase.ref(database, `rooms/${roomKey}/users`);
        realtimeDatabase.onValue(usersRef, async (snapshot: realtimeDatabase.DataSnapshot) => {
            if (!snapshot.exists()) {
                return;
            }
            const data = snapshot.val();
            setPointSelected(data[currentUserKey].point)
            delete data[currentUserKey]
            const keyValue = Object.entries(data) as [string, User][]
            const userList = keyValue.map(([key, value]) => ({ key, ...value }));
            setPlayers(userList.map(u => ({ username: u.username, point: u.point, key: u.key })))
            
            // Auto-update story score if cards are revealed and someone changes vote
            if (isShowAverage && currentStory?.name) {
                const name = currentStory.name.trim()
                if (name) {
                    const avg = calculateAverageCallback()
                    await saveScoredStoryCallback(name, avg, false) // Don't show toast for auto-updates
                }
            }
        });
    }, [roomKey, isShowAverage, currentStory, saveScoredStoryCallback, calculateAverageCallback])

    const onShowAverage = useCallback(() => {
        const database = realtimeDatabase.getDatabase(app)
        const usersRef = realtimeDatabase.ref(database, `rooms/${roomKey}`);
        realtimeDatabase.onValue(usersRef, async (snapshot: realtimeDatabase.DataSnapshot) => {
            const data = snapshot.val();
            const newIsShowAverage = !!data.isShowingAverage
            
            // Auto-save story when cards are revealed
            if (!isShowAverage && newIsShowAverage && currentStory?.name) {
                const name = currentStory.name.trim()
                if (name) {
                    const avg = calculateAverageCallback()
                    await saveScoredStoryCallback(name, avg)
                }
            }
            
            setIsShowAverage(newIsShowAverage)
        });
    }, [roomKey, isShowAverage, currentStory, saveScoredStoryCallback, calculateAverageCallback])

    const existsRoomByKey = useCallback(async (currentRoomKey: string) => {
        const database = realtimeDatabase.getDatabase(app)
        const roomRef = realtimeDatabase.ref(database, `rooms/${currentRoomKey}`)
        const snapshot = await realtimeDatabase.get(roomRef)
        return snapshot.exists();
    }, [])

    const initialLoads = useCallback(async () => {
        const existsRoom = await existsRoomByKey(roomKey)
        if (!existsRoom) {
            console.error('Room is not valid')
            router.push('/')
            return;
        }

        const user = getCurrentUser();
        if (!user) {
            console.error("User in storage is not valid");
            router.push(`/room/join/${roomKey}`)
            return;
        }

        setCurrentUser(user)
    }, [roomKey, router, existsRoomByKey])

    useEffect(() => {
        setValueToClipboard(window.location.href)
    }, [setValueToClipboard])

    useEffect(() => {
        initialLoads()
    }, [initialLoads])

    useEffect(() => {
        if (currentUser?.key) {
            onListPlayers(currentUser.key)
        }
    }, [currentUser, onListPlayers])

    useEffect(() => {
        onShowAverage()
    }, [onShowAverage])

    useEffect(() => {
        const database = realtimeDatabase.getDatabase(app)
        const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/pendingStories`)
        realtimeDatabase.onValue(ref, (snapshot: realtimeDatabase.DataSnapshot) => {
            const data = snapshot.val() || {}
            const list = Object.entries(data as Record<string, StoryPending>).map(([key, value]) => ({ key, ...(value as StoryPending) }))
            setPendingStories(list)
        })
    }, [roomKey])

    useEffect(() => {
        const database = realtimeDatabase.getDatabase(app)
        const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/stories`)
        realtimeDatabase.onValue(ref, (snapshot: realtimeDatabase.DataSnapshot) => {
            const data = snapshot.val() || {}
            const list = Object.entries(data as Record<string, StoryScored>).map(([key, value]) => ({ key, ...(value as StoryScored) }))
            setScoredStories(list)
        })
    }, [roomKey])

    useEffect(() => {
        const database = realtimeDatabase.getDatabase(app)
        const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/currentStory`)
        realtimeDatabase.onValue(ref, (snapshot: realtimeDatabase.DataSnapshot) => {
            const data = snapshot.val()
            setCurrentStory(data ?? null)
        })
    }, [roomKey])

    function getCurrentUser() {
        const storageUser = window.sessionStorage.getItem('currentUser')
        const currentUser = JSON.parse(storageUser ?? '{}') as CurrentUser
        if (!storageUser || !currentUser.key || !currentUser.username) {
            return null
        }
        return currentUser
    }

    async function handleSelectPoint(point: string) {
        setPointSelected(point)
        savePoint(point)
    }

    async function savePoint(point: string | null) {
        try {
            if (!currentUser) {
                throw new Error("Current user is not valid");
            }
            const database = realtimeDatabase.getDatabase(app)
            const pointRef = realtimeDatabase.ref(database, `rooms/${roomKey}/users/${currentUser.key}`);
            await realtimeDatabase.set(pointRef, {
                username: currentUser!.username,
                point: point
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Não foi possível concluir a ação',
                description: "Entre em contato com o suporte.",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
            })
            setPointSelected(null)
        }
    }

    function undoPoint() {
        setPointSelected(null)
        savePoint(null)
    }

    function handleCopyLink() {
        onCopy()
        toast({
            title: 'Copiado! Compartilhe com seu time',
            description: window.location.href,
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: 'top',
        })
    }

    const calculateAverageCallback = useCallback(() => {
        const total = players.reduce((acc: number, current: User) => {
            const value = Number(current.point)
            return isNaN(value) ? acc : acc + value
        }, 0)
        const castToNumber = Number(pointSelected)
        const value = isNaN(castToNumber) ? 0 : castToNumber
        const average = (total + value) / (players.length + 1)
        return average.toPrecision(3)
    }, [players, pointSelected])

    function calculateAverage() {
        return calculateAverageCallback()
    }

    async function saveIsShowingAvarageTo(isShowing: boolean) {
        const database = realtimeDatabase.getDatabase(app)
        const ref = realtimeDatabase.ref(database, `rooms/${roomKey}`);
        await realtimeDatabase.update(ref, { isShowingAverage: isShowing })
    }

    async function addPendingStory(name: string) {
        const database = realtimeDatabase.getDatabase(app)
        const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/pendingStories`)
        await realtimeDatabase.push(ref, { name } as StoryPending)
    }

    async function defineCurrentStory(name: string) {
        const database = realtimeDatabase.getDatabase(app)
        const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/currentStory`)
        await realtimeDatabase.set(ref, { name })
    }

    async function handleSelectPendingAsCurrent(story: { key: string; name: string }) {
        await defineCurrentStory(story.name)
    }

    const saveScoredStoryCallback = useCallback(async (name: string, average: string, showToast: boolean = true) => {
        const database = realtimeDatabase.getDatabase(app)
        
        // Check if story already exists in scored stories and update it
        const existingStory = scoredStories.find((s) => s.name === name)
        if (existingStory) {
            const scoredRef = realtimeDatabase.ref(database, `rooms/${roomKey}/stories/${existingStory.key}`)
            await realtimeDatabase.update(scoredRef, { average })
        } else {
            const scoredRef = realtimeDatabase.ref(database, `rooms/${roomKey}/stories`)
            await realtimeDatabase.push(scoredRef, { name, average } as StoryScored)
        }

        if (showToast) {
            toast({
                title: '📊 Pontuação salva!',
                description: `"${name}" pontuada com ${average}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
            })
        }

        // remove from pending if exists (only for new stories)
        if (!existingStory) {
            const matched = pendingStories.find((s) => s.name === name)
            if (matched) {
                const pendingRef = realtimeDatabase.ref(database, `rooms/${roomKey}/pendingStories/${matched.key}`)
                await realtimeDatabase.remove(pendingRef)
            }
        }
    }, [roomKey, scoredStories, pendingStories, toast])

    async function saveScoredStory(name: string, average: string, showToast: boolean = true) {
        return saveScoredStoryCallback(name, average, showToast)
    }

    async function handleClickNewRound() {
        const updates = listAllUsersWithPointsResetedToUpdate()
        const database = realtimeDatabase.getDatabase(app)
        const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/users`);
        await realtimeDatabase.update(ref, updates)
        await saveIsShowingAvarageTo(false)
        
        // Clear current story after new round
        if (currentStory?.name) {
            const currentRef = realtimeDatabase.ref(database, `rooms/${roomKey}/currentStory`)
            await realtimeDatabase.remove(currentRef)
        }
    }

    function listAllUsersWithPointsResetedToUpdate() {
        if (!currentUser) {
            throw new Error("Current user is not valid");
        }

        const updates = players.reduce((acc: { [k: string]: Partial<User> }, p) => {
            return {
                ...acc,
                [p.key!]: {
                    username: p.username,
                    point: null
                }
            }
        }, {})

        return { ...updates, [currentUser.key]: { username: currentUser.username, point: null } }
    }

    return (
        <Box h='100vh' py='12' overflow='hidden' position='relative'>
            {/* Stories Sidebar */}
            <StoriesSidebar
                pendingStories={pendingStories}
                scoredStories={scoredStories}
                storyInput={storyInput}
                onStoryInputChange={setStoryInput}
                onAddStory={async (name: string) => {
                    await addPendingStory(name);
                    await defineCurrentStory(name);
                    setStoryInput("");
                }}
                onSelectPendingStory={handleSelectPendingAsCurrent}
                currentStory={currentStory}
            />

            <Flex flexDir='column' position='absolute' top='4' left='4' gap='2'>
                <Tag variant='subtle'>
                    <Avatar
                        src={`https://api.multiavatar.com/${currentUser?.key ?? ''}.svg`}
                        size='xs'
                        name={currentUser?.username}
                        ml={-1}
                        mr={2}
                    />
                    {currentUser?.username}
                </Tag>

                <Button leftIcon={<LinkIcon />} variant='outline' onClick={handleCopyLink}>
                    Compartilhar
                </Button>
                <Button leftIcon={<AddIcon />} variant='outline' onClick={() => router.push('/')}>
                    Nova sala
                </Button>
            </Flex>
            <Flex flex='1' flexDir='column' w='full' gap='8'>
                <Box textAlign='center'>
                    <AnimatePresence>
                        {pointSelected && (
                            <Box as={motion.div} display='inline-block'>
                                <CardPoint
                                    headingSize='xl'
                                    point={pointSelected}
                                />
                                <Button
                                    as={motion.button}
                                    variants={{ hidden: { opacity: 0, }, visible: { opacity: 1, } }}
                                    initial='hidden'
                                    animate="visible"
                                    mt='4'
                                    variant='link'
                                    onClick={undoPoint}>Desfazer</Button>
                            </Box>
                        )}
                    </AnimatePresence>
                </Box>

                <Flex justifyContent='center'>
                    <Box pos='relative'>
                        <EffectDisable isVisible={!!pointSelected} />

                        <Wrap
                            display='inline-block'
                            p='8'
                            gap='4'
                            as={motion.div}
                            variants={{
                                hidden: {
                                    opacity: 1,
                                    scale: 0
                                },
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    transition: { delayChildren: 0.3, staggerChildren: 0.1 }
                                }
                            }}
                            initial='hidden'
                            animate="visible"
                            bgColor='purple.100'
                        >
                            {POINTS.map((value) => (
                                <WrapItem key={value}>
                                    <CardPoint
                                        headingSize='md'
                                        point={value}
                                        cardProps={{
                                            as: motion.div,
                                            onClick: () => handleSelectPoint(value),
                                            whileHover: { scale: 1.1 },
                                            _hover: { cursor: 'pointer' }
                                        }}
                                    />
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                </Flex>
            </Flex>

            <Flex h='80%' mx='12' flex='2'>
                <Flex flex='1' flexDir='column' gap='4' flexWrap='wrap' justifyContent='center'>
                    {leftCardPlayerList}
                </Flex>
                <Flex flex='2' alignItems='center' justifyContent='center'>
                    {!isShowAverage && (
                        <Box textAlign='center'>
                          {currentStory?.name && <Text mb='2' color='gray.600'>Estória atual: <b>{currentStory.name}</b></Text>}
                          <Button size='lg' onClick={() => saveIsShowingAvarageTo(true)}>REVELAR CARTAS</Button>
                        </Box>
                    )}
                    {isShowAverage && (
                        <Box>
                          {currentStory?.name && <Text mb='2' textAlign='center' color='gray.600'>Estória: <b>{currentStory.name}</b></Text>}
                          <Heading size='4xl' textAlign='center'>{calculateAverage()}</Heading>
                          <Button mt='4' w='full' onClick={handleClickNewRound}>Nova rodada</Button>
                        </Box>
                    )}
                </Flex>
                <Flex flex='1' flexDir='column' gap='4' flexWrap='wrap' justifyContent='center' alignItems='flex-end'>
                    {rigthCardPlayerList}
                </Flex>
            </Flex>
        </Box >
    );
}

