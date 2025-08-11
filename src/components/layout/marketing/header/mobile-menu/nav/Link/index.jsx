
import Link from 'next/link';
import { motion } from 'framer-motion';
import { slide, scale } from '../../anim';

export default function Index({data, isActive, setSelectedIndicator}) {
  
    const { label, href, index} = data;
  
    return (
      <motion.div onMouseEnter={() => {setSelectedIndicator(href)}} custom={index} variants={slide} initial="initial" animate="enter" exit="exit" >
        <motion.div variants={scale} animate={isActive ? "open" : "closed"} ></motion.div>
        <Link 
          href={href} 
          className={`
            ${isActive 
              ? "text-white font-bold" 
              : "text-white/80 hover:text-white "
            }
          `}
        >
          {label}
        </Link>
      </motion.div>
    )
  }