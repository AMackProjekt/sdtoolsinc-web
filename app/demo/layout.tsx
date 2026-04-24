import { DemoAuthProvider } from "@/lib/demo-auth";
import { DemoLayoutClient } from "@/components/demo/DemoLayoutClient";

export const metadata = {
  title: "Demo — T.O.O.L.S Inc Portals",
  description: "Interactive demo of all T.O.O.L.S Inc portal experiences. No login required.",
};

export default function DemoRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoAuthProvider>
     <DemoLayoutClient>
      {/* Demo Mode Banner */}
      <div className="sticky top-0 z-[200] flex items-center justify-center gap-3 bg-amber-400 px-4 py-2 text-xs font-bold tracking-wide text-black shadow-sm">
        <span className="rounded bg-black/15 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest">
          DEMO
        </span>
        <span>All data is simulated — no real account required.</span>
      </div>
      {children}
     </DemoLayoutClient>
    </DemoAuthProvider>
  );
}
