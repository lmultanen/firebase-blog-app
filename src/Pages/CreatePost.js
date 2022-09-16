import React, { useEffect, useState } from "react";
import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const CreatePost = ({isAuth}) => {
    const [post, setPost] = useState({
        title: '',
        content: ''
    })
    const navigate = useNavigate()
    const blogpostsCollectionRef = collection(db, 'blogposts')

    const changeHandler = props => event => {
        setPost({
            ...post,
            [props]: event.target.value
        })
    }

    useEffect(() => {
        if (!isAuth) {
            navigate('/login')
        }
    },[])

    const createPost = async (event) => {
        event.preventDefault()
        await addDoc(blogpostsCollectionRef, {
            ...post,
            author: {
                name: auth.currentUser.displayName,
                id: auth.currentUser.uid
            }
        });
        navigate('/')
    }

    const checkDisabled = () => {
        return !post.title.length || !post.content.length
    }

    return(
        <div className="create-post-page">
            <form>
                <h1 className="create-post-header">New Post</h1>
                <div className="input-group">
                    <label className="create-post-label"> Title: </label>
                    <input placeholder="Title..." onChange={changeHandler('title')}/>
                </div>
                <div className="input-group">
                    <label className="create-post-label"> Content: </label>
                    <textarea placeholder="Content..." onChange={changeHandler('content')}/>
                </div>
                <button onClick={createPost} className='submit-button' disabled={checkDisabled()}>Submit Post</button>
            </form>
        </div>
    )
}

export default CreatePost;