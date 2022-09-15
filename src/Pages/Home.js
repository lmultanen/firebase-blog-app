import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";

const Home = () => {
    const [postsList, setPostsList] = useState([]);
    const blogpostsCollectionRef = collection(db, 'blogposts')

    useEffect(() => {
        const getPosts = async () => {
            const data = await getDocs(blogpostsCollectionRef)
            setPostsList(data.docs.map((doc) => {
                return {...doc.data(), id: doc.id}
            }))
        }
        getPosts();
    },[])

    // const deletePost = async (id) => {
    //     const postDoc = doc(db, 'blogposts',id)
    //     await deleteDoc(postDoc)
    //     window.location.reload()
    // }

    return(
        <div className="home-page">
            {postsList.map((post, idx) => {
                return(
                    <div className="post-display" key={idx}>
                        <div><h1><Link to={`/posts/${post.id}`} className='post-link'>{post.title}</Link></h1><span> by @{post.author.name}</span></div>
                        {/* <div className="delete-post">
                            {isAuth && post.author.id === auth.currentUser.uid ?
                                <button onClick={() => deletePost(post.id)}> X </button>
                                : <></>
                            }
                        </div> */}
                        <p>{post.content}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Home;

// possible improvements
// -- be able to click on individual posts, take to a new route: /posts/{post id/slug or something}
// -- on individual posts, can look into added ability to write/see comments; can only write comments if isAuth is true
// -- obviously, can improve styling options as well

// -- could also add ability to click on individual authors and link to their page to see all posts by them