import { getPrompts } from "@/actions/prompts-actions";
import { Suspense } from "react";
import { Header } from "../../components/header";
import { LoadingGrid } from "./components/loading-grid";
import { PromptsGrid } from "./components/prompts-grid";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Prompts</h1>
          <Suspense fallback={<LoadingGrid />}>
            <PromptsContent />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// Separate async component to handle data fetching
async function PromptsContent() {
  const prompts = await getPrompts();
  return <PromptsGrid initialPrompts={prompts} />;
}
