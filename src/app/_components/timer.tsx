"use client"
import { useAuthContext } from "@/context/auth-context";
import { useTimer } from "@/hooks/useTimer";
import { db } from "@/lib/firebase";
import { formatTime } from "@/utils";
import { ActionIcon, Button, Group, Modal, Text, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconPlayerStopFilled, IconRotateClockwise } from "@tabler/icons-react";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import React from "react"

export default function Timer() {
   const [sessionTitle, setSessionTitle] = React.useState('');
   const [isSavingSession, setIsSavingSession] = React.useState(false)

   const { checkAuth, user } = useAuthContext();

   const {
      time,
      isTimerActive,
      handleResetTimer,
      handleStartTimer,
      handleStopTimer
   } = useTimer()

   const [
      isSaveSessionModalOpen,
      {
         open: openSaveSessionModal,
         close: closeSaveSessionModal,
      }
   ] = useDisclosure(false);

   const handleStart = () => {
      if (checkAuth()) {
         handleStartTimer();
      }
   };

   const handlePause = () => {
      if (checkAuth()) {
         handleStopTimer();
      }
   };

   const handleStop = () => {
      if (checkAuth() && time) {
         setSessionTitle('')
         setIsSavingSession(false)
         openSaveSessionModal()
         handleStopTimer();
      }
   };

   const handleCancel = () => {
      if (checkAuth()) {
         closeSaveSessionModal();
         handleStartTimer();
         setSessionTitle('');
         setIsSavingSession(false);
      }
   }

   const handleSaveSession = async (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault()

      try {
         setIsSavingSession(true)

         if (user && user.uid) {
            const sessionPayload = {
               id: nanoid(),
               time: time,
               title: sessionTitle,
               isArchived: false,
               createdAt: serverTimestamp()
            }

            const parentDocRef = doc(db, 'time_sessions', user.uid);
            const subCollectionRef = collection(parentDocRef, 'sessions')

            const createdDoc = await addDoc(subCollectionRef, sessionPayload)

            if (createdDoc.id) {
               closeSaveSessionModal();
               handleResetTimer();
               setSessionTitle('');
            }
         }
      } catch (error) {
         console.log(error)
         notifications.show({
            color: 'red',
            title: 'Error',
            message: 'An error occurred while saving your session. Please try again.',
         })
      } finally {
         setIsSavingSession(false)
      }
   }

   return (
      <React.Fragment>
         <div className="flex flex-col gap-6 lg:gap-10">
            <div className="text-6xl mx-auto font-semibold text-gray-700 lg:mx-0">
               {formatTime(time)}
            </div>
            <div className="flex gap-4 justify-center lg:justify-start">
               <Tooltip label='Start'>
                  <ActionIcon
                     disabled={isTimerActive}
                     onClick={handleStart}
                     color='green'
                     size={"xl"}
                  >
                     <IconPlayerPlayFilled />
                  </ActionIcon>
               </Tooltip>
               <Tooltip label='Pause'>
                  <ActionIcon
                     size={"xl"}
                     onClick={handlePause}
                     disabled={!time && isTimerActive}
                  >
                     <IconPlayerPauseFilled />
                  </ActionIcon>
               </Tooltip>
               <Tooltip label='Stop & Save'>
                  <ActionIcon
                     color="red"
                     size={"xl"}
                     onClick={handleStop}
                     disabled={isTimerActive && !time}
                  >
                     <IconPlayerStopFilled />
                  </ActionIcon>
               </Tooltip>
               <Tooltip label='Reset'>
                  <ActionIcon
                     size={"xl"}
                     color="orange"
                     onClick={handleResetTimer}
                  >
                     <IconRotateClockwise />
                  </ActionIcon>
               </Tooltip>
            </div>
         </div>
         <Modal
            centered
            size={'lg'}
            opened={isSaveSessionModalOpen}
            onClose={handleCancel}
            title={<p className='text-2xl font-semibold'>Save Session</p>}
         >
            <form onSubmit={handleSaveSession} className='flex flex-col mt-5'>
               <Group justify="space-between" mb={5}>
                  <Text component="label" htmlFor="session-name" fw={500}>
                     What is this session called?
                  </Text>
               </Group>
               <TextInput
                  id="session-name"
                  value={sessionTitle}
                  placeholder="eg. Time Tracker UI"
                  onChange={(e) => setSessionTitle(e.currentTarget.value)}
               />
               <div className="self-end mt-5 flex gap-3">
                  <Button
                     size='md'
                     variant='outline'
                     color="red"
                     onClick={handleCancel}
                  >
                     Discard
                  </Button>
                  <Button
                     size='md'
                     type='submit'
                     loading={isSavingSession}
                  >
                     Save
                  </Button>
               </div>
            </form>
         </Modal>
      </React.Fragment>
   )
}