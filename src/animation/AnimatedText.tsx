import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type AnimatedTextProps = {
  text: string;
  el?: keyof JSX.IntrinsicElements;
  className?: string;
}

const defaultAnimations = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
}

export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
}: AnimatedTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });

  return (
    <Wrapper className={className}>
      <span className="sr-only">
        {text}
      </span>

      <motion.span
        initial="hidden"
        transition={{ staggerChildren: 0.1 }}
        animate={isInView ? "visible" : "hidden"}
        aria-hidden
      >
        {text.split(" ").map((char, index) => (
          <motion.span
            key={index}
            ref={ref}
            variants={defaultAnimations}
            className="inline-block leading-relaxed"
          >
            {char}
            {char !== " " && <span style={{ display: 'inline-block', width: '0.25em' }} />}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
}