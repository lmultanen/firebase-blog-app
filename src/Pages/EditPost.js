import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";

const EditPost = ({ isAuth }) => {
    const params = useParams()
    const [post, setPost] = useState({})
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        let docToFetch = doc(db,'blogposts',params.id)
        const loadPost = async() => {
            let fetched = await getDoc(docToFetch);
            setPost(fetched.data())
            setTitle(fetched.data().title)
            setContent(fetched.data().content)
            //making sure only author can edit post
            if (!isAuth || (auth.currentUser.uid !== fetched.data().author.id)) {
                navigate(`/posts/${params.id}`)
            }
        }
        loadPost()
    },[])

    const saveChanges = async () => {
        const postDoc = doc(db,'blogposts',params.id)
        await updateDoc(postDoc, {
            title,
            content
        })
        navigate(`/posts/${params.id}`)
    }

    return(
        <div className="edit-post-page">
            <div className="post-container">
                <h1>Update Post</h1>
                <div className="input-group">
                    <label> Title: </label>
                    <input value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className="input-group">
                    <label> Content: </label>
                    <textarea value={content} onChange={(e)=>setContent(e.target.value)}/>
                </div>
                {/* <button onClick={createPost}>Submit Post</button> */}
                <div>
                    <button onClick={() => navigate(`/posts/${params.id}`)}>Discard Changes</button>
                    <button onClick={() => saveChanges()}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}

export default EditPost;