import { Provider } from 'react-redux';

import AppShell from './src/AppShell';
import { I18nProvider } from './src/i18n';
import { store } from './src/store/store';

export default function App() {
  return (
    <Provider store={store}>
      <I18nProvider locale="es">
        <AppShell />
      </I18nProvider>
    </Provider>
  );
}
