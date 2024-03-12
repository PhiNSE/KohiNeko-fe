import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      className=''
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
