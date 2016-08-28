const DISPATCH_FORM = 'app/helper/DISPATCH_FORM';

export default function helperReducer(state = {}, action) {
  switch(action.type) {
    case DISPATCH_FORM: {
      return state;
    }
    default: {
      return state;
    }
  }
}

export function dispatchForm(form) {
  return {
    type: DISPATCH_FORM,
    form
  };
}

