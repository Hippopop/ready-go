import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
        uid: string
    }>
}

export default async function PortfolioPage({ params }: PageProps) {
    const { uid } = await params
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", uid)
        .single()

    if (!profile) {
        notFound()
    }

    return (
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
            <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Portfolio of {profile.full_name ?? profile.email}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Coming soon — full portfolio in Step 8
                    </p>
                </div>
                <div className="pt-8 flex justify-center gap-4 items-center">
                    <div className="h-px w-12 bg-border" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Phase 1 Foundation
                    </span>
                    <div className="h-px w-12 bg-border" />
                </div>
            </div>
        </main>
    )
}
