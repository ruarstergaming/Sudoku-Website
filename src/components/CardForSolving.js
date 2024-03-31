import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import sudokuImage from '../images/sudoku.png'

function CardForSolving() {
  return (
      <Card border="white" bg='white' style={{  }}>
        <Card.Img class='card-image' variant="top" src={sudokuImage} />
        <Card.Body>
          <Card.Text>
            Start solving sudoku puzzles now on the #1 
            site in Fife!
          </Card.Text>
          <Button href="fpf06/select-puzzle" variant="primary">Select Puzzle</Button>
        </Card.Body>
      </Card>
  );
}

export default CardForSolving;