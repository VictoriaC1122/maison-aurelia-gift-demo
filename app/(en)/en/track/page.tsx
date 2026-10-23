import { TrackView, trackMetadata } from "@/components/views/track";

export const metadata = trackMetadata("en");

export default function Page() {
  return <TrackView locale="en" />;
}
