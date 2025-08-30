import { apiRequest } from "./queryClient";

export async function downloadSampleReport() {
  const response = await fetch("/api/sample-report");
  if (!response.ok) {
    throw new Error("Failed to download sample report");
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample-transparency-report.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function downloadReport(reportId: string, productName: string) {
  const response = await fetch(`/api/reports/${reportId}/download`);
  if (!response.ok) {
    throw new Error("Failed to download report");
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${productName}-transparency-report.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
