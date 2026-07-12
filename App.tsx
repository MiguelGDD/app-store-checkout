import { Provider } from 'react-redux';

import AppShell from './src/AppShell';
import { store } from './src/store/store';

export default function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
