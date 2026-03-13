import { RoomsTable } from "./rooms-table";

export default function RoomsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Phòng học</h1>
      <RoomsTable />
    </div>
  );
}
