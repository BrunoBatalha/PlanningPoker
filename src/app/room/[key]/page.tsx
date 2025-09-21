'use client'
import { ButtonShareRoom, CardOtherPlayer, CardPoint, EffectDisable } from "@/components";
import { roomService } from "@/services/RoomService";
import { userService } from "@/services/UserService";
import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Flex, Heading, Tag, Wrap, WrapItem, useToast } from "@chakra-ui/react";
import { onValue, ref } from "firebase/database";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { database } from "../../../../firebase";
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



const POINTS = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕']

export default function Page({ params: { key: roomKey } }: { params: ParamsUrl }) {
    const router = useRouter()
    const toast = useToast()
    const [currentUser, setCurrentUser] = useState<CurrentUser>()
    const [pointSelected, setPointSelected] = useState<string | null>(null)
    const [players, setPlayers] = useState<User[]>([])
    const [isShowAverage, setIsShowAverage] = useState(false)

    const leftCardPlayerList = useMemo(() => {
        const playersLeft = players.length > 1 ? players.slice(0, players.length / 2) : players
        return playersLeft.map((p, index) => (
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
        return playersRight.map((p, index) => (
            <CardOtherPlayer
                key={index}
                point={p.point}
                username={p.username}
                showPoint={isShowAverage}
            />
        ))
    }, [players, isShowAverage])

    useEffect(() => {
        const initialLoads = async () => {
            const existsRoom = await roomService.roomExists(roomKey)
            if (!existsRoom) {
                console.error('Room is not valid')
                router.push('/')
                return;
            }

            const user = userService.getCurrentUser();
            if (!user) {
                console.error("User in storage is not valid");
                router.push(`/room/join/${roomKey}`)
                return;
            }

            setCurrentUser(user)
        }

        initialLoads()
    }, [roomKey, router])

    useEffect(() => {
        if (currentUser?.key) {
            userService.onPlayersUpdate(roomKey, (users) => {
                const currentUserIndex = users.findIndex(p => p.key === currentUser.key);
                setPointSelected(users[currentUserIndex].point)            
                setPlayers(users.filter(u => u.key !== currentUser.key))
            })
        }
    }, [currentUser, roomKey])

    useEffect(() => {
        const onShowAverage = () => {
            const usersRef = ref(database, `rooms/${roomKey}`);
            onValue(usersRef, (snapshot) => {
                const data = snapshot.val();
                setIsShowAverage(!!data.isShowingAverage)
            });
        }

        onShowAverage()
    }, [roomKey])

    async function handleSetPoint(point: string) {
        setPointSelected(point)
        savePoint(point)
    }

    async function savePoint(point: string | null) {
        try {
            if (!currentUser) {
                throw new Error("Current user is not valid");
            }
            await userService.savePoint(roomKey, currentUser.key, currentUser.username, point!)
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

    function calculateAverage() {
        const total = players.reduce((acc, current) => {
            const value = Number(current.point)
            return isNaN(value) ? acc : acc + value
        }, 0)
        const castToNumber = Number(pointSelected)
        const value = isNaN(castToNumber) ? 0 : castToNumber
        const average = (total + value) / (players.length + 1)
        return average.toPrecision(3)
    }

    async function handleClickNewRound() {
        await userService.resetPointsAllUsers(roomKey)
        setPointSelected(null)
        savePoint(null)
        await roomService.hiddenAvarage(roomKey)
    }

    return (
        <Box h='100vh' py='12' overflow='hidden' position='relative'>
            <Flex flexDir='column' position='absolute' top='4' left='4' gap='2'>
                <Tag variant='subtle'>
                    <Avatar
                        // src={`https://api.multiavatar.com/${currentUser?.key ?? ''}.svg`}
                        size='xs'
                        name={currentUser?.username}
                        ml={-1}
                        mr={2}
                    />
                    {currentUser?.username}
                </Tag>


                <ButtonShareRoom />
                <Button leftIcon={<AddIcon />} variant='outline' onClick={() => router.push('/')}>
                    Nova sala
                </Button>
            </Flex>
            <Flex h='80%' mx='12' flex='2'>
                <Flex flex='1' flexDir='column' gap='4' flexWrap='wrap' justifyContent='center'>
                    {leftCardPlayerList}
                </Flex>
                <Flex flex='2' alignItems='center' justifyContent='center'>
                    {!isShowAverage && <Button size='lg' onClick={() => roomService.showAvarage(roomKey)}>REVELAR CARTAS</Button>}
                    {isShowAverage &&
                        <Box>
                            <Heading size='4xl' textAlign='center'>{calculateAverage()}</Heading>
                            <Button mt='4' w='full' onClick={handleClickNewRound}>Nova rodada</Button>
                        </Box>
                    }
                </Flex>
                <Flex flex='1' flexDir='column' gap='4' flexWrap='wrap' justifyContent='center' alignItems='flex-end'>
                    {rigthCardPlayerList}
                </Flex>
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
                                            onClick: () => handleSetPoint(value),
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
        </Box >
    );
}

