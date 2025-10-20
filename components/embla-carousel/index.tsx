import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./embla-dot-button";
import { PrevButton, NextButton, usePrevNextButtons } from "./embla-arrow";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { X, House, NotebookPen, Save, Loader2 } from "lucide-react";
import "./embla.css";

type PropType = {
  slides: any[];
  options?: EmblaOptionsType;
};

export const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla w-full">
      <div className="embla__viewport !w-full" ref={emblaRef}>
        <div className="embla__container gap-2 px-4 w-full !mx-auto justify-center">
          {slides.map((doc, index) => (
            <div
              className={cn(
                "embla__slide rounded-md border border-violet-300 h-32 w-4 max-w-80 p-3",
                "flex flex-col"
              )}
              key={index}
            >
              <div className="items-center text-sm font-semibold truncate">
                <span>{doc.title}</span>
              </div>
              <div className="text-xs line-clamp-5">
                {doc.content.replace(/<[^>]+>/g, "")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls !flex !w-full !m-0 !p-0 justify-center">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
