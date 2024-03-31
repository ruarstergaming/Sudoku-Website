import {React, useState} from 'react'
import Rating from '@mui/material/Rating';
import { serverURL } from './constants'
import Button from 'react-bootstrap/Button'

function PuzzleRate() {

    const [rating, setRating] = useState(0)

    const onSubmit = async function() {
        let submitResponse = await submitRating(window.location.search.split("=")[1], rating)
        if (submitResponse['rated']) {
            alert("Puzzle successfully rated!")
        } else {
            alert("Couldn't submit rating! Have you already rated this puzzle?");
        }
    }

    const submitRating = async function(puzzle_id, rating) {
        let reqObj = {
            "id": puzzle_id,
            "rating": rating
        }
        let response = await fetch(serverURL + "/rate-puzzle", {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(reqObj)
        });
        return await response.json();
    }

    return (
        <div>
            <div>
                <label id="rating-label">Rate this puzzle!</label>
                <br></br>
                <Rating 
                    name="puzzle-rating" 
                    value={rating} 
                    precision={0.5}
                    size="medium" 
                    onChange = {(event, newValue) => {
                        setRating(newValue);  // set but don't send new value
                    }}
                />
            
                <br></br>
                <Button size="sm" onClick = {onSubmit}>Submit rating!</Button>
                <br></br>
                <br></br>
                <hr id="sudoku-line-break"/>
            </div>
        </div>
    )
}

export default PuzzleRate;