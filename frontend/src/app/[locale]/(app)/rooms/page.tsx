import { RoomsTable } from "./rooms-table";

export default function RoomsPage() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex shrink-0 flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Phòng học</h1>
        <div className="text-muted-foreground text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis rerum
          distinctio nobis ullam, error odio voluptates.
        </div>
      </div>
      <div className="min-h-[50vh] flex-1 shrink-0">
        <RoomsTable />
      </div>
    </div>
  );
}
