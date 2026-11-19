import type { Metadata } from "next";
import { DidYouKnowWidget } from "@/components/ui/DidYouKnowWidget";

export const metadata:Metadata = {
  title:"Did You Know? | T.O.O.L.S. Inc.",
  description:"Explore nine interactive T.O.O.L.S. Inc. resource topics for reentry, housing navigation, documents, employment and workforce readiness.",
};
export default function DidYouKnowPage() {
  return <main className="min-h-screen bg-[#061021] px-4 py-10 text-white sm:py-16">
    <div className="mx-auto max-w-4xl">
      <a href="/" className="mb-7 inline-flex text-sm font-bold text-amber-300 hover:underline">← Back to T.O.O.L.S. Inc.</a>
      <header className="mb-6 flex items-center gap-4">
        <img src="/logos/tools-inc-crown-official.svg" alt="T.O.O.L.S. Inc. official crown logo" width={76} height={78} className="h-20 w-auto object-contain"/>
        <div><p className="text-xl font-black">T.O.O.L.S. Inc.</p><p className="text-xs text-slate-300">Empowering Individuals. Unlocking Potential.</p></div>
      </header>
      <DidYouKnowWidget />
    </div>
  </main>;
}