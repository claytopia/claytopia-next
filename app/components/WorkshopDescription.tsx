'use client';

import { useState, type ReactNode } from 'react';

export function WorkshopDescription({
  heading,
  summary,
  details,
}: {
  heading?: string;
  summary: ReactNode;
  details?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="prose prose-lg text-foreground-muted">
        {heading && (
          <h4 className="font-serif text-xl text-foreground mb-2">{heading}</h4>
        )}
        {summary}
      </div>

      {details && (
        <>
          {expanded && (
            <div className="prose prose-lg text-foreground-muted">{details}</div>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="text-primary font-medium hover:underline"
          >
            {expanded ? 'Weniger' : 'Mehr'}
          </button>
        </>
      )}
    </div>
  );
}
