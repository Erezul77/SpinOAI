
export function exportSessionToJSON(messages: any[], filename = "session.json") {
  const blob = new Blob([JSON.stringify(messages, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
