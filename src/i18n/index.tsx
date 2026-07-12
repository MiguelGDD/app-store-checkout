import { createContext, useContext, useMemo, type ReactNode } from 'react';

import {
  defaultLocale,
  messages,
  type Locale,
  type TranslationKey,
} from './messages';

type MessageParams = Record<string, string | number>;

type I18nContextValue = {
  locale: Locale;
  t: (key: TranslationKey, params?: MessageParams) => string;
};

function interpolate(template: string, params?: MessageParams): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, rawKey: string) => {
    const value = params[rawKey];
    return value === undefined || value === null ? '' : String(value);
  });
}

function createTranslator(locale: Locale) {
  return (key: TranslationKey, params?: MessageParams) => {
    const template = messages[locale][key] ?? messages[defaultLocale][key];
    return interpolate(template, params);
  };
}

const defaultValue: I18nContextValue = {
  locale: defaultLocale,
  t: createTranslator(defaultLocale),
};

const I18nContext = createContext<I18nContextValue>(defaultValue);

type I18nProviderProps = {
  children: ReactNode;
  locale?: Locale;
};

export function I18nProvider({ children, locale = defaultLocale }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: createTranslator(locale),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function translate(
  key: TranslationKey,
  params?: MessageParams,
  locale: Locale = defaultLocale,
) {
  return createTranslator(locale)(key, params);
}
