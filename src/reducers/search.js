import {
  HANDLE_SUBMIT,
  GO_NEXT,
  GO_PREVIOUS
} from '../actions'


const searchReducer = (state = {}, action) => {

  switch (action.type) {

    case HANDLE_SUBMIT:
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
      state = {
        ...state,
        after: null,
        before: action.before,
        first: null,
        last: action.last,
      };
      return state;

    default:
      return state;
  }
}


export default searchReducer;