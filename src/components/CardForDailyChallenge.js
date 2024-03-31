import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import dailyPuzzle from '../images/daily-calendar.png'

function CardForSolving() {
  return (
      <Card border="white" bg='white' style={{  }}>
        <Card.Img class='card-image' variant="top" src={dailyPuzzle} />
        <Card.Body>
          <Card.Text>
            Improve your Sudoku skills with the daily challenge - new puzzles every day!
          </Card.Text>
          <Button href="fpf06/daily-challenge" variant="primary">Daily challenge</Button>
        </Card.Body>
      </Card>
  );
}

export default CardForSolving;