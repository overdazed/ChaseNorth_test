import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WobbleCard } from "./wobble-card";

export const LayoutGrid = ({ cards: initialCards, isDay = true }) => {
    const navigate = useNavigate();
    const [cards, setCards] = useState(initialCards);
    const [selected, setSelected] = useState(null);
    const [lastSelected, setLastSelected] = useState(null);
    const [shouldNavigate, setShouldNavigate] = useState(false);

    useEffect(() => {
        if (shouldNavigate && selected?.id === 1) {
            navigate('/collections/all', { state: { gender: 'Women' } });
            setShouldNavigate(false);
        }
    }, [shouldNavigate, selected, navigate]);

    const handleClick = (card) => {
        if (selected?.id === card.id) {
            setShouldNavigate(true);
            return;
        }
        setLastSelected(selected);
        setSelected(card);
    };

    const handleOutsideClick = () => {
        setLastSelected(selected);
        setSelected(null);
    };

    return (
        <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative z-0">
            {cards.map((card, i) => (
                <div key={i} className={cn(card.className, {
                    'transition-all duration-300': selected && selected.id !== card.id
                })}>
                    {/*{!selected ? (*/}
                    {/*    <WobbleCard */}
                    {/*      containerClassName="h-full w-full rounded-xl overflow-hidden" */}
                    {/*      className="p-0"*/}
                    {/*      reducedBounce={i === 0 || i === 3} // Card 1 and 4 (0 and 3 index)*/}
                    {/*      isDay={isDay}*/}
                    {/*    >*/}
                    {/*        <motion.div*/}
                    {/*            onClick={() => handleClick(card)}*/}
                    {/*            className="relative overflow-hidden group h-full w-full"*/}
                    {/*            layoutId={`card-${card.id}`}*/}
                    {/*        >*/}
                    {/*            <div className="absolute inset-0 w-full h-full">*/}
                    {/*                <ImageComponent */}
                    {/*                    card={card} */}
                    {/*                    className="absolute inset-0 w-full h-full object-cover"*/}
                    {/*                    style={{*/}
                    {/*                        minWidth: '100%',*/}
                    {/*                        minHeight: '100%',*/}
                    {/*                        width: 'auto',*/}
                    {/*                        height: 'auto',*/}
                    {/*                        objectFit: 'cover',*/}
                    {/*                        objectPosition: card.objectPosition || 'center',*/}
                    {/*                    }}*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        </motion.div>*/}
                    {/*    </WobbleCard>*/}
                    {/*) : (*/}
                    {!selected ? (
                        <WobbleCard
                            containerClassName="h-full w-full rounded-xl overflow-hidden"
                            className="p-0"
                            reducedBounce={i === 0 || i === 3}
                            isDay={isDay}
                        >
                            <div
                                className="relative h-full w-full"
                                onClick={() => handleClick(card)}
                            >
                                <div className="absolute inset-0 w-full h-full">
                                    <ImageComponent
                                        card={card}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        style={{
                                            minWidth: '100%',
                                            minHeight: '100%',
                                            width: 'auto',
                                            height: 'auto',
                                            objectFit: 'cover',
                                            objectPosition: card.objectPosition || 'center',
                                        }}
                                    />
                                </div>
                                {card.content}
                            </div>
                        </WobbleCard>
                    ) : (
                        // <motion.div
                        //     onClick={() => handleClick(card)}
                        //     className={cn(
                        //         card.className,
                        //         "relative overflow-hidden group",
                        //         selected?.id === card.id
                        //             ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-40 flex justify-center items-center flex-wrap flex-col"
                        //             : lastSelected?.id === card.id
                        //                 ? `z-0 ${isDay ? 'bg-neutral-50' : 'bg-neutral-950'} rounded-xl h-full w-full`
                        //                 : `${isDay ? 'bg-neutral-50' : 'bg-neutral-950'} rounded-xl h-full w-full`
                        //     )}
                        //     layoutId={`card-${card.id}`}
                        // >
                        //     {selected?.id === card.id && <SelectedCard selected={selected} />}
                        //     <div className={cn(
                        //         "absolute inset-0 transition-all duration-300 ease-out overflow-hidden rounded-xl",
                        //         selected !== null && selected.id !== card.id && "blur-sm scale-[0.98]"
                        //     )}
                        //     style={{
                        //         zIndex: selected?.id === card.id ? 50 : 1
                        //     }}
                        //     >
                        //         <div className="h-full w-full rounded-xl overflow-hidden">
                        //             <ImageComponent card={card} className={cn(
                        //                 "h-full w-full object-cover",
                        //                 selected && selected.id !== card.id ? "brightness-75" : ""
                        //             )} />
                        //         </div>
                        //     </div>
                        // </motion.div>
                        <motion.div
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    handleClick(card);
                                }
                            }}
                            className={cn(
                                card.className,
                                "relative overflow-hidden group",
                                selected?.id === card.id
                                    ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-40 flex justify-center items-center flex-wrap flex-col"
                                    : lastSelected?.id === card.id
                                        ? `z-0 ${isDay ? 'bg-neutral-50' : 'bg-neutral-950'} rounded-xl h-full w-full`
                                        : `${isDay ? 'bg-neutral-50' : 'bg-neutral-950'} rounded-xl h-full w-full`
                            )}
                            layoutId={`card-${card.id}`}
                        >
                            {selected?.id === card.id && <SelectedCard selected={selected} />}
                            <div className={cn(
                                "absolute inset-0 transition-all duration-300 ease-out overflow-hidden rounded-xl",
                                // selected.id !== card.id && "blur-sm scale-[0.98]"
                                selected !== null && selected.id !== card.id && "blur-sm scale-[0.98]"
                            )}
                                 style={{
                                     zIndex: selected?.id === card.id ? 50 : 1
                                 }}
                            >
                                <div className="h-full w-full rounded-xl overflow-hidden">
                                    <ImageComponent card={card} className={cn(
                                        "h-full w-full object-cover",
                                        selected && selected.id !== card.id ? "brightness-75" : ""
                                    )} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            ))}
            <motion.div
                onClick={handleOutsideClick}
                className={cn(
                    "fixed inset-0 z-40",
                    selected?.id ? "pointer-events-auto" : "pointer-events-none"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: selected?.id ? 0.5 : 0 }}
                transition={{ duration: 0.2 }}
            />
        </div>
    );
};

const ImageComponent = ({ card, className, style }) => {
    return (
        <motion.img
            layoutId={`image-${card.id}-image`}
            src={card.thumbnail}
            height="500"
            width="500"
            className={cn(
                "object-cover absolute inset-0 h-full w-full transition duration-200",
                className,
                card.id === 4 ? "object-top md:object-center" : "object-center"
            )}
            alt="thumbnail"
            style={{
                ...style,
                objectPosition: card.id === 4 ? "center 30%" : (card.objectPosition || "center")
            }}
        />
    );
};

// In Bento.jsx
const SkeletonOne = ({ onClick }) => (
    <div className="h-full w-full relative">
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            className="absolute inset-0 w-full h-full z-10 cursor-pointer text-left p-6"
            style={{ background: 'transparent', border: 'none' }}
        >
            <p className="font-bold md:text-4xl text-xl text-white">
                Women
            </p>
            {/*<p className="font-normal text-base my-4 max-w-lg text-neutral-200">*/}
            {/*    Explore our women's collection*/}
            {/*</p>*/}
            {/*<div className="mt-4 text-white underline">*/}
            {/*    Shop now*/}
            {/*</div>*/}
        </button>
    </div>
);

const SelectedCard = ({ selected }) => {
    if (!selected) return null;

    return (
        <div className="h-full w-full relative rounded-xl overflow-hidden" style={{ zIndex: 2000 }}>
            <div className="absolute inset-0 z-0">
                <img
                    src={selected.thumbnail}
                    alt="thumbnail"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
            <div className="relative z-20 h-full w-full flex flex-col justify-end p-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                >
                    {selected.content}
                </motion.div>
            </div>
        </div>
    );
};
