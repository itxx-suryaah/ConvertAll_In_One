import { Header } from "../../components/layout/header";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <main className="container p-4 md:p-8 w-full">{children}</main>
    </div>
  );
}
