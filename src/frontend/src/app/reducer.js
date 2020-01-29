const appReducer = (state = { flash: null }, action) => {
  switch (action.type) {
    case 'ADD_FLASH': {
      return {
        ...state,
        flash: {
          message: action.message,
          role: action.role
        }
      };
    }

    case 'CLEAR_FLASH': {
      return {
        ...state,
        flash: null
      };
    }

    default:
      return state;
  }
};

export default appReducer;
