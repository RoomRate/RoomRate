import React from 'react';
import { LoadingIcon } from './LoadingIcon';

export const AsyncPageWrapper = ({ children, status }) => {
  if (Array.isArray(status)) {
    if (status.includes(`loading`) || status.includes(`idle`)) {
      return <LoadingIcon />;
    }
    else if (status.includes(`error`)) {
      return <div>Error</div>;
    }
    else if (status.every(s => s === `success`)) {
      return <>{children}</>;
    }
    throw new Error(`Unhandled status: ${status.join(`, `)}`);
  } else {
    switch (status) {
      case `loading`:
      case `idle`:
        return <LoadingIcon />;
      case `error`:
        return <div>Error</div>;
      case `success`:
        return <>{children}</>;
      default:
        throw new Error(`Unhandled status: ${status}`);
    }
  }
};
