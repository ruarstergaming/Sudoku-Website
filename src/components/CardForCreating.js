import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import createSudoku from '../images/edit-tools.png';

function CardForCreating() {
  return (
      <Card border="white" bg='white' style={{}}>
        <Card.Img class='card-image' variant="top" src={createSudoku} />
        <Card.Body>
          <Card.Text>
            Create puzzles and upload them to our database for other 
            users to solve!
          </Card.Text>
          <Button href='fpf06/create-puzzle' variant="primary">Start designing</Button>
        </Card.Body>
      </Card>
  );
}

export default CardForCreating;