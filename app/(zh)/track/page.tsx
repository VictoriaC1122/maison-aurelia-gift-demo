import { TrackView, trackMetadata } from "@/components/views/track";

export const metadata = trackMetadata("zh");

export default function Page() {
  return <TrackView locale="zh" />;
}
