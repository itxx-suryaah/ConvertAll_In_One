import { ToolHeader } from "../../../components/tool-header";
import { PassportPhotoEditor } from "../../../components/passport-photo-editor";
import { TOOLS } from "../../../lib/constants";
export default function PassportPhotoPage() {
  const tool = TOOLS.find((t: typeof TOOLS[number]) => t.href === "/passport-photo")!;

  return (
    <div className="w-full">
      <ToolHeader title={tool.name} description={tool.description} />
      <PassportPhotoEditor />
    </div>
  );
}
