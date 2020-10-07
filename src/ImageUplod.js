import React, { useState } from 'react'

import './ImageUpload.css'

import firebase from 'firebase'
import { storage, db } from './firebase'

import { Button } from '@material-ui/core'


function ImageUpload({ username }) {
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (err) => {
                //error functon
                console.log(err)
                alert(err.message)
            },
            () => {
                //complete function ...
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgress(0)
                        setCaption('')
                        setImage(null)
                    })
            }
        )
    }

    return (
        <div className='imageUpload'>
            <progress className='imageUpload__progress' value={progress} max='100' />
            <input type="text" placeholder='Enter a caption' value={caption} onChange={(e) => setCaption(e.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload