"use client";
import { MaskContainer } from "@/components/ui/svg-mask-effect";

export function SVGMaskHover({ isNightMode = false }) {
    if (!isNightMode) return null;
    
    return (
        <div className="flex h-[50rem] w-full items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-950">
            <MaskContainer
                revealText={
                    <p className="mx-auto max-w-5xl text-center text-5xl font-bold text-neutral-950 dark:text-neutral-50">
                        The first rule of MRR Club is you do not talk about MRR Club. The
                        second rule of MRR Club is you DO NOT talk about MRR Club.
                    </p>
                }
                className="h-full w-full rounded-md"
            >
                <div className="text-neutral-50 hover:text-neutral-950 transition-colors duration-300 max-w-5xl text-5xl">
                    Discover the power of{" "}
                    <span className="text-blue-500">Tailwind CSS v4</span> with native CSS
                    variables and container queries with{" "}
                    <span className="text-blue-500">advanced animations</span>.
                </div>
            </MaskContainer>
        </div>
    );
}
