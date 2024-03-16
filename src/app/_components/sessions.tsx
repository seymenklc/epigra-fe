"use client"
import { useAuthContext } from "@/context/auth-context"
import { db } from "@/lib/firebase"
import { TimeSession } from "@/types"
import { formatFirebaseTimestamp, formatTime } from "@/utils"
import { collection, deleteDoc, doc, orderBy, query, updateDoc } from "firebase/firestore"
import moment from "moment"
import { useCollection } from "react-firebase-hooks/firestore"
import React from 'react'
import { ActionIcon, Tabs, Tooltip } from "@mantine/core"
import { IconArchive, IconTrash } from "@tabler/icons-react"

enum TabType {
   RecentSessions = 'recent-sessions',
   ArchivedSessions = 'archived-sessions'
}

export default function Sessions() {
   const { user } = useAuthContext()
   const [currentTab, setCurrentTab] = React.useState<TabType>(TabType.RecentSessions)

   const [snapshots, loading] = useCollection(
      query(
         collection(db, 'time_sessions', user?.uid!, 'sessions'),
         orderBy('createdAt', 'desc')
      ),
   )

   const handleArchiveSession = async (id: string, archived: boolean) => {
      try {
         const docRef = doc(db, 'time_sessions', user?.uid!, 'sessions', id)
         await updateDoc(docRef, { isArchived: !archived })
      } catch (error) {
         console.error(error)
      }
   }

   const handleDeleteSession = async (id: string) => {
      try {
         const docRef = doc(db, 'time_sessions', user?.uid!, 'sessions', id)
         await deleteDoc(docRef)
      } catch (error) {
         console.error('Error removing document: ', error)
      }
   }

   return (
      <div className="flex flex-col gap-4">
         <Tabs defaultValue={TabType.RecentSessions} onChange={(value) => setCurrentTab(value as TabType)} >
            <Tabs.List>
               <Tabs.Tab value={TabType.RecentSessions}>
                  Recent Sessions
               </Tabs.Tab>
               <Tabs.Tab value={TabType.ArchivedSessions}>
                  Archived Sessions
               </Tabs.Tab>
            </Tabs.List>
            <div className="grid gap-4 w-full mt-4">
               {loading && [...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-gray-200 rounded-lg p-12 h-5" />
               ))}
               {!loading && snapshots?.empty && (
                  <div className="text-center text-lg">
                     No sessions found
                  </div>
               )}
               {!loading && currentTab === TabType.ArchivedSessions && snapshots?.docs.every(doc => !doc.data().isArchived) && (
                  <div className="text-center text-lg">
                     No archived sessions found
                  </div>
               )}
               {!loading && currentTab === TabType.RecentSessions && snapshots?.docs.every(doc => doc.data().isArchived) && (
                  <div className="text-center text-lg">
                     No recent sessions found
                  </div>
               )}
               {!loading && !snapshots?.empty && snapshots?.docs.map(doc => {
                  const { time, title, createdAt, isArchived } = doc.data() as TimeSession

                  if (currentTab === TabType.ArchivedSessions && !isArchived) {
                     return null
                  }

                  if (currentTab === TabType.RecentSessions && isArchived) {
                     return null
                  }

                  return (
                     <div className="group flex gap-2" key={doc.id} >
                        <span className="hidden group-hover:flex flex-col justify-between py-1">
                           <Tooltip label={isArchived ? 'Unarchive' : 'Archive'} position="left">
                              <ActionIcon size={'lg'} onClick={() => handleArchiveSession(doc.id, isArchived)}>
                                 <IconArchive />
                              </ActionIcon>
                           </Tooltip>
                           <Tooltip label='Delete' position="left">
                              <ActionIcon onClick={() => handleDeleteSession(doc.id)} color="red" size={'lg'}>
                                 <IconTrash />
                              </ActionIcon>
                           </Tooltip>
                        </span>
                        <div className="flex w-full justify-between items-center p-4 bg-white rounded-lg border border-gray-300">
                           <div className='gap-1 flex flex-col'>
                              <p className="text-lg font-semibold">
                                 {title}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                 {moment(formatFirebaseTimestamp(createdAt)).format('MMM DD, YYYY - hh:mm A')}
                              </p>
                           </div>
                           <div className="text-lg font-semibold">
                              {formatTime(time)}
                           </div>
                        </div>
                     </div>
                  )
               })}
            </div>
         </Tabs>
      </div>
   )
}