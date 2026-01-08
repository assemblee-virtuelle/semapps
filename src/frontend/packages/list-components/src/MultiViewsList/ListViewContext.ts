import React from 'react';

const ListViewContext = React.createContext({ views: null, currentView: null, setView: () => null });

export default ListViewContext;
