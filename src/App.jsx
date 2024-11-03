/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"



export default function App() {

    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState("")
    const [tempNoteText, setTempNoteText] = useState("")

    const sortedArray = notes.sort((a,b) => b.updatedAt  - a.updatedAt)



    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]


    /* 
        /* The {onSnapshot} function in Firestore is used to set up a real-time listener that triggers a callback every time the data in a specific Firestore collection changes. Here is an explanation of its arguments:
        
        Collection Reference: The first argument passed to onSnapshot is the reference to the Firestore collection you want to listen to. In the provided code snippet, notesCollection is the reference to the Firestore collection where the notes are stored. This is the collection that the listener will be attached to.
        Callback Function: The second argument is a callback function that will be called every time there is a change in the specified collection. This function receives a snapshot object as a parameter, which represents the current state of the collection at the time the callback is triggered.
        In the provided code snippet, the callback function takes the snapshot object and performs the following actions:
        
        Maps over the docs array in the snapshot to extract the data of each document.
        Creates an array of note objects by spreading the document data and adding an id field with the document's ID.
        Updates the local state notes with the new array of note objects, effectively syncing the local state with the latest data from the Firestore collection.
        By using onSnapshot, the component stays in sync with the Firestore collection in real-time, ensuring that any changes to the notes in the collection are reflected immediately in the UI.
   */

    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id, 
            }))

            setNotes(notesArr)
        })

        return unsubscribe
    }, [])

    useEffect(()=>{
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    useEffect(() => {
      if(currentNote){
        setTempNoteText(currentNote.body)
      }

    }, [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])
    

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(), 
            updatedAt: Date.now()
        }
       
        const newNoteRef =  await addDoc(notesCollection, newNote)

        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef =  doc(db,'notes' , currentNoteId )
        await setDoc(docRef, {body:text, updatedAt: Date.now()}, {merge: true} )
    }

    async function deleteNote( noteId) {
       const docRef =  doc(db,'notes' ,noteId )
       await  deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedArray}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
