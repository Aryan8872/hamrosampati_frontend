declare module 'react-slick' {
  import { ComponentType } from 'react';

  interface SliderProps {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    pauseOnHover?: boolean;
    responsive?: Array<{
      breakpoint: number;
      settings: Partial<SliderProps>;
    }>;
    [key: string]: unknown;
  }

  const Slider: ComponentType<SliderProps>;
  export default Slider;
}
