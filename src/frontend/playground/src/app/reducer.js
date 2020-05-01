import produce from 'immer';

const appReducer = (state = { flash: null }, action) =>
  produce(state, newState => {
    switch (action.type) {
      case 'ADD_FLASH':
        newState.flash = {
          message: action.message,
          role: action.role
        };
        break;

      case 'CLEAR_FLASH':
        newState.flash = null;
        break;

      default:
        break;
    }
  });

export default appReducer;
