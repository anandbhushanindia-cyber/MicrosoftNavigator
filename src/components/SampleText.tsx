import { motion } from 'framer-motion'

type SampleTextProps = {
  title: string
  subtitle: string
  caption: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function SampleText({ title, subtitle, caption }: SampleTextProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-panel rounded-3xl p-8 shadow-glass"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-aurora/80">{caption}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base text-mist/90 md:text-lg">
        {subtitle}
      </p>
    </motion.div>
  )
}
