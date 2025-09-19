import type { AlertColor } from "@mui/material";
import eventEmitter from "./eventEmitter";

export function showNotification(
  message: string = "No message",
  severity: AlertColor = "info"
) {
  eventEmitter.emit("showNotification", { message, severity });
}
