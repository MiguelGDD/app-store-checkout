import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { BackendSyncCard } from '../src/components/BackendSyncCard';

function renderCard(
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null = null,
) {
  let renderer: ReactTestRenderer.ReactTestRenderer;

  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <BackendSyncCard
        status={status}
        error={error}
        source="backend"
        lastSyncedAt="2026-07-12T00:00:00.000Z"
        onRetry={jest.fn()}
      />,
    );
  });

  return renderer!;
}

describe('BackendSyncCard', () => {
  it('renders the idle state', () => {
    const renderer = renderCard('idle');
    expect(JSON.stringify(renderer.toJSON())).toContain('Idle');
  });

  it('renders the loading state', () => {
    const renderer = renderCard('loading');
    expect(JSON.stringify(renderer.toJSON())).toContain('Syncing');
  });

  it('renders the success state', () => {
    const renderer = renderCard('succeeded');
    expect(JSON.stringify(renderer.toJSON())).toContain('Connected');
  });

  it('renders the error state', () => {
    const renderer = renderCard('failed', 'Backend unavailable');
    expect(JSON.stringify(renderer.toJSON())).toContain('Backend unavailable');
  });
});
