const INITIAL_STATE = {
  currentStory: 1
};

export default function configReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    default: {
      return state;
    }
  }
}

