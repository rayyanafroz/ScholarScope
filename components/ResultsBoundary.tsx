"use client";

import { catchError, type ErrorInfo } from "next/error";

import ErrorState from "@/components/ErrorState";

/**
 * Backstop for unexpected render errors in the results area. Expected
 * failures (rate limits, timeouts, non-200s) never throw: Results renders
 * <ErrorState> for those with a specific message.
 */
function ResultsErrorFallback(_props: object, { error, retry }: ErrorInfo) {
  console.error(error);
  return (
    <ErrorState
      detail="An unexpected error occurred while showing these results."
      onRetry={retry}
    />
  );
}

export default catchError(ResultsErrorFallback);
