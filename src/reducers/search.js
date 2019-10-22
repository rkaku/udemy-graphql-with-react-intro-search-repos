import {
  HANDLE_CHANGE,
  GO_NEXT,
  GO_PREVIOUS
} from '../actions'


const searchReducer = (state = {}, action) => {

  switch (action.type) {

    case HANDLE_CHANGE:
      state = { ...state, query: action.query };
      return state;

    case GO_NEXT:
      state = {
        ...state,
        after: action.after,
        before: null,
        first: action.first,
        last: null,
      };
      return state;

    case GO_PREVIOUS:
      return state;

    default:
      return state;
  }
}


export default searchReducer;