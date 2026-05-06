import { useEffect, useState } from 'react';
import { DataState } from './DataState';
import { PageCard } from './PageCard';
import { SimpleTable } from './SimpleTable';

export function ResourcePage({ title, subtitle, columns, loader, mapper }) {
  const [state, setState] = useState({ loading: true, error: '', rows: [] });

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const response = await loader();
        const data = Array.isArray(response?.data) ? response.data : [];
        if (active) {
          setState({ loading: false, error: '', rows: data.map(mapper) });
        }
      } catch (error) {
        if (active) {
          const message = error?.response?.data?.message || 'Request failed';
          setState({ loading: false, error: message, rows: [] });
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [loader, mapper]);

  return (
    <PageCard title={title} subtitle={subtitle}>
      <DataState loading={state.loading} error={state.error} empty={state.rows.length === 0}>
        <SimpleTable columns={columns} rows={state.rows} />
      </DataState>
    </PageCard>
  );
}
