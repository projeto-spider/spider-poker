const INITIAL_STATE = [{
  average: 0,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  cards: [],
  flipped: 0,
  id: 0,
  position: 2
}, {
  average: 0,
  description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo',
  cards: [],
  flipped: 0,
  id: 1,
  position: 1
}, {
  average: 0,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  cards: [],
  flipped: 0,
  id: 2,
  position: 3
}, {
  average: 0,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  cards: [],
  flipped: 0,
  id: 3,
  position: 4
}];

export default function storiesReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@@INIT': {
      return orderStories(state);
    }
    default: {
      return state;
    }
  }
}

/* Helper */
function orderStories(stories) {
  return stories.sort((a, b) => a.position - b.position);
}

