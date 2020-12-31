export const addFlash = (message, role = 'success') => ({
  type: 'ADD_FLASH',
  message,
  role
});

export const clearFlash = () => ({
  type: 'CLEAR_FLASH'
});
