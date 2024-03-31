import { useEffect, useState } from "react";
import { ToggleButton } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Alert from 'react-bootstrap/Alert';
import { serverURL } from "./constants";

import downArrowImg from '../images/down-arrow.png'

function CommentSection() {

    const [commentText, setCommentText] = useState("");
    const [confirmWithUser, setConfirmWithUser] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsElements, setCommentsElements] = useState([]);
    const [checked, setChecked] = useState(false);

    async function reqDeleteComment(id) {
        await fetch(serverURL + "/delete-comment?id=" + id);
        setChecked(false) ; await showComments() ;
    }

    function constructCommentHTML(comment) {
        let delete_visibility = "hidden"; // by default cannot see delete buttoh
        if (comment.owned) delete_visibility = "visible"; // but if comment is owned it is shown
        // not an issue if user uses inspector to make these visible - serverside check ensures they still cannot delete a comment they haven't posted
        return (
            
            <div id = {comment.id} key = {comment.id}>
                <br></br>
                <div id = {"header-" + comment.id}>
                    <p><b>{comment.author} -  {new Date(comment.post_date).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</b></p>
                </div>
                <div id = {"body-" + comment.id}>
                    <p>"{comment.body_text}"</p>
                    <Button variant="danger" size="sm" id = {"delete-" + comment.id} onClick={e => {reqDeleteComment(comment.id)}} style = {{visibility: delete_visibility}}>Delete comment</Button>
                </div>
            </div>
        )
    }

    async function renderComments() {
        let elementList = [];
        for (var comment of comments) {
            elementList.push(constructCommentHTML(comment));
        }
        elementList.reverse(); // reverse so newest comments rendered at the top
        await setCommentsElements(elementList);
    }

    async function fetchComments() {
        let res = await fetch(serverURL + "/get-comments?id=" + window.location.search.split("=")[1]);
        let commentArr = await res.json();
        setComments(commentArr);
        await renderComments();
    }

    useEffect(() => {
        async function update() {
            await fetchComments();
        }
        update();
    }, [checked, confirmWithUser]);

    function onInputChange(event) {
        setCommentText(event.target.value)
    }

    async function submitComment() {
        if (commentText === "" || commentText.replace(/\s/g, "").length === 0) {alert("You can't submit an empty comment!"); return;}; // if comment is empty or contains only spaces
        let commentObj = {
            puzzle_id: window.location.search.split("=")[1], // puzzle id
            body_text: commentText
        }
        await fetch(serverURL + "/post-comment", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentObj)
        });
        setConfirmWithUser(true);
        setCommentText("");
        setChecked(false);


    }

    if (confirmWithUser){
        return (
            <Alert variant="success" onClose={() => {setConfirmWithUser(false)}} dismissible>
                <p>
                Comment successfully submitted!
                </p>
            </Alert>
        )
    }

    async function showComments() {
        let section = document.getElementById("comment-section");
        if (section.style.display === "none") {
            await fetchComments();
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    }

    return (
        <div>
            <p>Leave a comment  <img src={downArrowImg} style={{width:"20px", height:"20px"}} alt = "down-arrow"/></p>
            <div>
                <input id="comment-input" type = "text" onChange={onInputChange} value={commentText}></input>
            </div>
            <div>
                <Button id="submit-comment" onClick={submitComment}>Submit comment</Button>
            </div>
            
            <div>
                <ToggleButton id= 'show-comments' type="checkbox" variant='outline-secondary' checked={checked} 
                onChange={(e) => {setChecked(e.currentTarget.checked) ; showComments()}}>{checked ? 'Hide comments' : 'Show comments'}</ToggleButton>
            </div>
            
            <div id = "comment-section" style = {{"display": "none"}}>

                <div id = "comment-display">
                    {commentsElements}
                </div>
            </div>
            
        </div>
    
    )
}

export default CommentSection;