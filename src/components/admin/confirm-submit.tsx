"use client";

import type { ComponentPropsWithoutRef } from "react";

export function ConfirmSubmit({ message, children, ...props }: ComponentPropsWithoutRef<"button"> & { message: string }) {
  return <button type="submit" {...props} onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>{children}</button>;
}
