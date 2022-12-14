import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";

const SinglePost = ({ isAuth }) => {
    const params = useParams()
    const [post, setPost] = useState({})
    const [comment, setComment] = useState('')
    const [commentsList, setCommentsList] = useState([])

    const commentsCollectionRef = collection(db,'comments')
    const navigate = useNavigate();

    useEffect(() => {
        let docToFetch = doc(db,'blogposts',params.id)
        const loadPost = async () => {
            let fetched = await getDoc(docToFetch);
            setPost(fetched.data())
        }
        loadPost();
        loadComments();
    },[])

    const checkDisabled = () => {
        return !comment.length;
    }

    const loadComments = async () => {
        let commentQuery = query(commentsCollectionRef, where('postId', '==', params.id))
        let comments = await getDocs(commentQuery)
        setCommentsList(comments.docs.map(doc => ({...doc.data(),id: doc.id})))
    }

    const postComment = async () => {
        await addDoc(commentsCollectionRef, {
            comment,
            author: {
                name: auth.currentUser.displayName,
                id: auth.currentUser.uid
            },
            postId: params.id
        })
        setComment('');
        window.location.reload();
    }

    const deleteComment = async (id) => {
        const commentDoc = doc(db, 'comments', id);
        await deleteDoc(commentDoc)
        loadComments()
    }
    const deletePost = async () => {
        let commentsCopy = [...commentsList];
        while (commentsCopy.length) {
            await deleteComment(commentsCopy.pop().id)
        }
        const postDoc = doc(db, 'blogposts',params.id)
        await deleteDoc(postDoc)
        navigate('/')
    }


    return( post.title ?
        <div className="single-post">
            <div className="single-post-details">
                <h1 className="single-post-title">{post.title}</h1>
                <div className="by-author">{`by @${post.author.name}`}</div>
                {isAuth && auth.currentUser.uid === post.author.id ?
                    <div className="edit-delete-buttons">
                        <button className="edit-post" onClick={() => navigate(`/posts/edit/${params.id}`)}>
                            Edit Post
                        </button>
                        <button className="delete-post" onClick={() => deletePost()}>
                            Delete Post
                        </button>
                    </div>
                    : <></>
                }
                <p className="single-post-content">{post.content}</p>
            </div>
            <div className="single-post-comments">
                <span className="comments-header">Comments:</span>
                {commentsList.map((comment,idx) => {
                    return(
                        <div className="displayed-comment" key={idx}>
                            <p className="comment-content">{comment.comment}</p>
                            <div className="comment-author">{`-@${comment.author.name}`}
                            {isAuth && (auth.currentUser.uid === comment.author.id || auth.currentUser.uid === post.author.id) ?
                                <button onClick={()=>deleteComment(comment.id)}>X</button>
                                : <></>
                            }</div>
                        </div>
                    )
                })}
                {isAuth ? 
                    <div className="new-comment-form">
                        <textarea placeholder="Add comment..." onChange={(event) => setComment(event.target.value)}/>
                        <button disabled={checkDisabled()} onClick={postComment}>Post Comment</button>
                    </div>
                    : <></>
                }
            </div>
        </div>
        : <div>Loading...</div>
    )
}

export default SinglePost;