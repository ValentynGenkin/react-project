import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import useFetch from '../Hooks/useFetch';
import LoadingSpinner from './LoadingSpinner';
import Title from './Title';
import PaginationComponent from './Pagination';
import { useState } from 'react';
import FavoriteButton from './FavoriteButton';
import { useSelectFavorite } from '../Context/FavoriteRecipe';

function RecipeList() {
  const { meal_type, category } = useParams();

  const [offset, setOffset] = useState(0);
  const url = `https://api.spoonacular.com/recipes/complexSearch?number=20&offset=${offset}&${category}=${meal_type}`;

  const [data, error] = useFetch(url);
  const { favorite, setFavorite } = useSelectFavorite();

  const saveFavorite = (id) => {
    if (!favorite.includes(id)) {
      setFavorite([...favorite, id]);
    } else {
      setFavorite([...favorite.filter((filteredItem) => filteredItem !== id)]);
    }
  };

  return (
    <Container>
      <Title text={meal_type} />

      <Container
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}
      >
        {data ? (
          data.results.map((meal) => (
            <Card key={meal.id} style={{ width: '14rem', margin: '10px' }}>
              <Card.Img variant="top" src={meal.image} />
              <Card.Body
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Card.Title>{meal.title}</Card.Title>
                <div>
                  <FavoriteButton
                    meal={meal}
                    saveFavorite={saveFavorite}
                    favorite={favorite}
                  />
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <LoadingSpinner />
        )}
      </Container>
      {data ? (
        <PaginationComponent
          pages={
            Math.floor(data.totalResults / 20) <= 45
              ? Math.floor(data.totalResults / 20)
              : 45
          }
          setOffset={setOffset}
        />
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
}
export default RecipeList;
