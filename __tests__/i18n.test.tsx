import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { I18nProvider, translate, useI18n } from '../src/i18n';
import { messages } from '../src/i18n/messages';

function LocaleProbe() {
  const { locale, t } = useI18n();

  return <Text>{`${locale}:${t('common.orderNumber', { number: 7 })}`}</Text>;
}

describe('i18n', () => {
  it('interpolates parameters and replaces missing values with empty strings', () => {
    expect(translate('common.orderNumber', { number: 7 })).toBe('Pedido 7');
    expect(
      translate('common.orderNumber', {
        number: undefined as never,
      }),
    ).toBe('Pedido ');
    expect(
      translate('common.orderNumber', {
        number: null as never,
      }),
    ).toBe('Pedido ');
  });

  it('provides the requested locale through context', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <I18nProvider locale="en">
          <LocaleProbe />
        </I18nProvider>,
      );
    });

    expect(JSON.stringify(renderer!.toJSON())).toContain('en:Pedido 7');
  });

  it('uses the default locale when no locale is provided', () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <I18nProvider>
          <LocaleProbe />
        </I18nProvider>,
      );
    });

    expect(JSON.stringify(renderer!.toJSON())).toContain('es:Pedido 7');
  });

  it('falls back to the default locale when a locale key is missing', () => {
    const mutableMessages = messages as unknown as {
      en: Record<string, string>;
    };
    const originalValue = mutableMessages.en['common.orderNumber'];
    delete mutableMessages.en['common.orderNumber'];

    expect(translate('common.orderNumber', { number: 7 }, 'en')).toBe(
      'Pedido 7',
    );

    mutableMessages.en['common.orderNumber'] = originalValue;
  });
});
