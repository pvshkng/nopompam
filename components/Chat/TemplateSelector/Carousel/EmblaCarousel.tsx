import "./embla.css";

import React, { useCallback, useEffect, useState } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoscroll from "embla-carousel-auto-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useChatContext } from "@/components/Chat/ChatContext/ChatContext";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";

type PropType = {
  slides: any[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { handleSend } = useChatContext();
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoscroll({ speed: 0.3, startDelay: 200, playOnInit: true }),
  ]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const toggleAutoplay = useCallback(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;

    const playOrStop = autoScroll.isPlaying()
      ? autoScroll.stop
      : autoScroll.play;
    playOrStop();
  }, [emblaApi]);

  const scroll = useCallback(
    (direction: "next" | "previous") => {
      const autoScroll = emblaApi?.plugins()?.autoScroll;
      if (!autoScroll) return;
      autoScroll.stop();
      direction === "previous" ? onPrevButtonClick() : onNextButtonClick();
      setTimeout(() => {
        autoScroll.play();
      }, 500);
    },
    [emblaApi, onPrevButtonClick, onNextButtonClick]
  );

  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;

    setIsPlaying(autoScroll.isPlaying());
    emblaApi
      .on("autoScroll:play", () => setIsPlaying(true))
      .on("autoScroll:stop", () => setIsPlaying(false))
      .on("reInit", () => setIsPlaying(autoScroll.isPlaying()))
      .on("reInit", onScroll)
      .on("scroll", onScroll)
      .on("slideFocus", onScroll);
  }, [emblaApi, onScroll]);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((t, i) => (
            <div className="embla__slide" key={i}>
              <div
                onClick={() => handleSend(t?.prompt, t?.usecase.toLowerCase())}
                className={cn(
                  "border rounded-lg hover:drop-shadow-lg bg-gradient-to-br from-emerald-50 to-white cursor-pointer h-48 relative",
                  "transition-all",
                  "hover:-translate-y-1",
                  "active:translate-y-1",
                  "hover:shadow-[rgba(22,163,74,0.4)_0px_0px_0px_2px,_rgba(34,197,94,0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]"
                )}
                key={i}
              >
                <div className={cn("p-4 overflow-hidden")}>
                  <h1
                    className={cn(
                      "line-clamp-5",
                      "text-pretty truncate whitespace-normal overflow-hidden",
                      "text-base font-semibold text-green-600"
                    )}
                  >
                    {t?.prompt}
                  </h1>
                </div>

                <div className="absolute pb-4 px-4 bottom-0 w-full">
                  <div className="flex flex-row justify-between items-center">
                    <div className="text-[10px] text-gray-500 pt-auto">
                      USECASE: {t?.usecase.toUpperCase()}
                    </div>
                    <Image
                      src={"/icon/spark.svg"}
                      alt="template icon"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            onClick={() => {
              scroll("previous");
            }}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => {
              scroll("next");
            }}
            disabled={nextBtnDisabled}
          />
        </div>

        <div className="embla__progress">
          <div
            className="embla__progress__bar"
            style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
          />
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
