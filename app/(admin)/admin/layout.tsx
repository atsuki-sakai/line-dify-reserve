export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full mx-auto p-8 flex-1 flex flex-col">
        <h1 className="text-4xl font-bold mb-8">管理者用ログイン</h1>
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
