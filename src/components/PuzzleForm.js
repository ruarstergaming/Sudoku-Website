import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import Button from 'react-bootstrap/Button'
import { serverURL } from './constants';

function PuzzleForm() {

    const [variant, setVariant] = useState("sudoku");
    const [difficulty, setDifficulty] = useState("easy");
    const [ rating, setRating ] = useState(5);

    function mapDiffStrToInt(difficulty) {
        if (difficulty === "easy") return 1;
        if (difficulty === "medium") return 5;
        if (difficulty === "hard") return 10;
        return 5;
    }

    async function getMatchingPuzzles(low_variant, map_diff, min_rating) {
        let query_str = "v=" + low_variant + "&d=" + map_diff + "&r=" + min_rating;
        let res = await fetch(serverURL + "/get-matching-puzzles?" + query_str);
        let puzzle = await res.json();
        if (puzzle.id === undefined) {
            alert("No puzzles matching your criteria could be found on the server.")
        } else {
            window.location.href = "/fpf06/solve-puzzle?id=" + puzzle.id;
        }
    }

    function onSubmit(event) {
        event.preventDefault();
        let low_variant;
        variant === "Knight's Variant" ? low_variant = "knights-sudoku" : low_variant = variant.toLowerCase();
        let map_diff = mapDiffStrToInt(difficulty.toLowerCase());
        let min_rating = rating;
        getMatchingPuzzles(low_variant, map_diff, min_rating);
    }

    return (
    <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
        <Form.Label>Variant</Form.Label>
        <Form.Select value={variant} onChange={e => setVariant(e.target.value)}>
            <option>Sudoku</option>
            <option>Knight's Variant</option>
        </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Difficulty</Form.Label>
        <Form.Select value={difficulty} onChange={e => setDifficulty(e.target.value)} >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
        </Form.Select>
        </Form.Group>

        <Form.Label>Minimum Rating</Form.Label>
        <RangeSlider
        value={rating}
        onChange={e => setRating(e.target.value)}
        step={0.5}
        min={0.5}
        max={5}
        />

        <Button type = "submit">Go</Button>
    </Form>
    );
}

export default PuzzleForm;