
/*
 * A file containing JSON schemas used to validate any puzzle being uploaded to the site.
 * This is much more efficient than a simple brute-force string manipulation technqiue as it is likely 
 * faster and more readable.
 */

const Ajv = require('ajv');

let twodarr_schema = {
    $id: "/twodarr_schema",
    "type": "array",
    "items": {
        anyOf: [{type: 'integer'}]
    }
}

let data_schema = {
    $id: "/data_schema",
    "type": "object",
    "properties": {
        "puzzle": {"type": "array", "items": {anyOf: [twodarr_schema]}},
        "solution": {"type": "array", "items": {anyOf: [twodarr_schema]}}
    },
    "required": ['puzzle']
}

let puzzle_schema = {
    $id: "schemas/puzzle_schema",
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "variant": {"type": "string"},
        "data": {anyOf: [data_schema]},
        "comments": {"type": "array", "items": {anyOf: [{type: "object"}]}},
        "author": {"type": ["string", "null", "object"]},
        "difficulty": {"type": "integer"},
        "sumRatings": {"type": "number"},
        "numRatings": {"type": "integer"},
        "createDate": {type: ["string", "null", "object"]}
    },
    "required": ['name', 'variant', 'data', 'difficulty']
};

const ajv = new Ajv();

const validate_puzzle = ajv.compile(puzzle_schema);

module.exports = {
    validate_puzzle
}