import { exportOrdersCsv } from "@/lib/order-store";

export async function GET() {
  const csv = await exportOrdersCsv();
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=maison-aurelia-orders.csv"
    }
  });
}
