# 🚀 LANDING PAGE MAJORMIND - ULTIMATE ADVANCED ENHANCEMENT PROMPT
## Ultra-Modern, Animation-Rich, Interactive Experience with Cutting-Edge UI/UX

---

## 🎯 ENHANCEMENT OBJECTIVE

Transform the existing MajorMind landing page into an **ultra-advanced, animation-rich, highly interactive** experience that:
- Retains ALL existing content and structure (13 sections)
- Adds cutting-edge animations and micro-interactions
- Implements modern UI/UX patterns (glassmorphism, neumorphism, gradient meshes)
- Creates immersive 3D visualizations and interactive demos
- Delivers a premium, enterprise-grade user experience
- Maximizes engagement through gamification and storytelling

---

## 🎨 ADVANCED ANIMATION FRAMEWORK

### ANIMATION TECHNOLOGY STACK

**Primary Animation Libraries**:
```typescript
// Core animation engines
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import Lottie from 'lottie-react'

// 3D and advanced visuals
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Float } from '@react-three/drei'

// Particle systems
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'

// Advanced charts
import { Chart as ChartJS } from 'chart.js'
import * as d3 from 'd3'
```


### GLOBAL ANIMATION PRINCIPLES

**1. Smooth Scroll Experience**
```typescript
// Implement buttery-smooth scrolling with GSAP ScrollSmoother
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const smoother = ScrollSmoother.create({
  smooth: 2,              // Smoothness level (0-3)
  effects: true,          // Enable data-speed parallax
  smoothTouch: 0.1,       // Mobile smooth scroll
  normalizeScroll: true   // Prevent scroll jank
})
```

**2. Stagger Animations**
```typescript
// Elegant entrance animations for lists and grids
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
}
```

**3. Scroll-Triggered Reveals**
```typescript
// Progressive content reveal as user scrolls
useEffect(() => {
  gsap.utils.toArray('.reveal-section').forEach((section: any) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        toggleActions: 'play none none reverse'
      },
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  })
}, [])
```


**4. Magnetic Cursor Effect**
```typescript
// Interactive cursor that attracts to interactive elements
const MagneticCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
    
    const magneticElements = document.querySelectorAll('.magnetic')
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursorRef.current, {
          scale: 2,
          backgroundColor: '#10B981',
          duration: 0.3
        })
      })
      
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorRef.current, {
          scale: 1,
          backgroundColor: '#1E3A8A',
          duration: 0.3
        })
      })
    })
    
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])
  
  return (
    <div 
      ref={cursorRef}
      className="fixed w-6 h-6 rounded-full pointer-events-none z-50 mix-blend-difference"
      style={{ backgroundColor: '#1E3A8A' }}
    />
  )
}
```

---

## 🌟 SECTION-BY-SECTION ENHANCEMENTS

### SECTION 1: HERO SECTION - ULTRA-IMMERSIVE EXPERIENCE

**Visual Enhancements**:

**1. Animated Gradient Mesh Background**
```typescript
// Dynamic gradient that responds to mouse movement
const HeroBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    })
  }
  
  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(30, 58, 138, 0.8) 0%, 
            rgba(16, 185, 129, 0.4) 50%, 
            rgba(245, 158, 11, 0.2) 100%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Floating particles */}
      <Particles
        options={{
          particles: {
            number: { value: 50 },
            color: { value: '#ffffff' },
            opacity: { value: 0.3 },
            size: { value: 3 },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              out_mode: 'out'
            }
          }
        }}
      />
    </div>
  )
}
```


**2. Animated Typography with Split Text**
```typescript
// Headline that animates character by character
const AnimatedHeadline: React.FC<{ text: string }> = ({ text }) => {
  useEffect(() => {
    const split = new SplitText('.hero-headline', { type: 'chars' })
    
    gsap.from(split.chars, {
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.02,
      duration: 1,
      ease: 'back.out(1.7)'
    })
  }, [])
  
  return (
    <h1 className="hero-headline text-6xl md:text-8xl font-bold text-white leading-tight">
      {text}
    </h1>
  )
}

// Usage
<AnimatedHeadline text="Salah Pilih Jurusan = 4 Tahun Terbuang" />
```

**3. Animated Statistics Counter**
```typescript
// Count-up animation for impressive numbers
const AnimatedCounter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const counterRef = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.to({ val: 0 }, {
            val: end,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              setCount(Math.floor(this.targets()[0].val))
            }
          })
        }
      },
      { threshold: 0.5 }
    )
    
    if (counterRef.current) observer.observe(counterRef.current)
    return () => observer.disconnect()
  }, [end])
  
  return (
    <span ref={counterRef} className="text-5xl font-bold text-emerald-400">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Usage
<AnimatedCounter end={10000} suffix="+" />
<AnimatedCounter end={95.71} suffix="%" />
```

**4. 3D Floating Elements**
```typescript
// Three.js floating geometric shapes
const FloatingShapes: React.FC = () => {
  return (
    <Canvas className="absolute inset-0 pointer-events-none">
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-2, 1, 0]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial 
            color="#10B981" 
            wireframe 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[2, -1, 0]}>
          <torusGeometry args={[0.4, 0.15, 16, 100]} />
          <meshStandardMaterial 
            color="#F59E0B" 
            wireframe 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      </Float>
      
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
```


**5. Glassmorphism CTA Button**
```typescript
// Modern glass-effect button with hover animations
const GlassCTAButton: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => {
  return (
    <motion.button
      className="relative px-12 py-6 text-xl font-bold text-white overflow-hidden group magnetic"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl" />
      
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Text */}
      <span className="relative z-10 flex items-center gap-3">
        {text}
        <motion.svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </motion.svg>
      </span>
      
      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/30 rounded-2xl"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  )
}
```

**6. Scroll Indicator Animation**
```typescript
// Animated scroll indicator
const ScrollIndicator: React.FC = () => {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      onClick={() => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
      }}
    >
      <span className="text-white/70 text-sm uppercase tracking-wider">Scroll to Explore</span>
      <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
        <motion.div
          className="w-1.5 h-1.5 bg-white rounded-full"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}
```

---

### SECTION 2: PROBLEM STATEMENT - INTERACTIVE VISUALIZATION

**1. Animated Bias Heatmap**
```typescript
// Interactive heatmap showing cognitive biases
const BiasHeatmap: React.FC = () => {
  const biases = [
    { name: 'Peer Pressure', intensity: 85, color: '#EF4444' },
    { name: 'Parental Pressure', intensity: 78, color: '#F59E0B' },
    { name: 'Prestige Bias', intensity: 72, color: '#F59E0B' },
    { name: 'Recency Bias', intensity: 65, color: '#FBBF24' }
  ]
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {biases.map((bias, index) => (
        <motion.div
          key={bias.name}
          className="relative p-6 rounded-xl overflow-hidden cursor-pointer group"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Background intensity */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: bias.color }}
            initial={{ opacity: 0.2 }}
            whileHover={{ opacity: 0.4 }}
          />
          
          {/* Content */}
          <div className="relative z-10">
            <h4 className="text-xl font-bold text-white mb-2">{bias.name}</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${bias.intensity}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <span className="text-white font-bold">{bias.intensity}%</span>
            </div>
          </div>
          
          {/* Hover tooltip */}
          <motion.div
            className="absolute inset-0 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <p className="text-white text-sm text-center">
              {bias.name === 'Peer Pressure' && 'Mengikuti pilihan teman tanpa pertimbangan rasional'}
              {bias.name === 'Parental Pressure' && 'Ekspektasi orang tua vs kemampuan aktual'}
              {bias.name === 'Prestige Bias' && 'Memilih jurusan "bergengsi" tanpa minat intrinsik'}
              {bias.name === 'Recency Bias' && 'Terpengaruh tren sesaat tanpa analisis jangka panjang'}
            </p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
```


**2. Animated Comparison Flow Diagram**
```typescript
// Traditional vs Algorithmic decision-making flow
const ComparisonFlowDiagram: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<'traditional' | 'algorithmic'>('traditional')
  
  return (
    <div className="relative">
      {/* Toggle buttons */}
      <div className="flex justify-center gap-4 mb-12">
        <motion.button
          className={`px-8 py-4 rounded-xl font-bold transition-all ${
            activeFlow === 'traditional' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => setActiveFlow('traditional')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Traditional Method
        </motion.button>
        
        <motion.button
          className={`px-8 py-4 rounded-xl font-bold transition-all ${
            activeFlow === 'algorithmic' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => setActiveFlow('algorithmic')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          MajorMind Algorithmic
        </motion.button>
      </div>
      
      {/* Animated flow */}
      <AnimatePresence mode="wait">
        {activeFlow === 'traditional' ? (
          <motion.div
            key="traditional"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="space-y-6"
          >
            {[
              { step: 'Intuisi Pribadi', icon: '🤔', accuracy: '45%' },
              { step: 'Saran Teman', icon: '👥', accuracy: '52%' },
              { step: 'Tes Minat Sederhana', icon: '📝', accuracy: '58%' },
              { step: 'Konseling Manual', icon: '👨‍🏫', accuracy: '68%' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="flex items-center gap-4 p-6 bg-red-50 border-2 border-red-200 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-4xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.step}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-red-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: item.accuracy }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-red-600 font-bold">{item.accuracy}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="algorithmic"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {[
              { step: 'RIASEC Psychometric', icon: '🧠', accuracy: '85%' },
              { step: 'IRT-CAT Adaptive Test', icon: '🎯', accuracy: '88%' },
              { step: 'AHP Weight Validation', icon: '⚖️', accuracy: '92%' },
              { step: 'Hybrid TOPSIS Algorithm', icon: '🚀', accuracy: '95.71%' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="flex items-center gap-4 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-4xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.step}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-emerald-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: item.accuracy }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-emerald-600 font-bold">{item.accuracy}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```


**3. Consequence Timeline Animation**
```typescript
// Timeline showing consequences of wrong major choice
const ConsequenceTimeline: React.FC = () => {
  const consequences = [
    { year: 'Year 1', event: 'Kehilangan Motivasi', impact: 'Moderate', color: '#FBBF24' },
    { year: 'Year 2', event: 'Academic Burnout', impact: 'High', color: '#F59E0B' },
    { year: 'Year 3', event: 'Pertimbangan Drop-Out', impact: 'Critical', color: '#EF4444' },
    { year: 'Year 4', event: 'Kerugian Finansial 100jt+', impact: 'Severe', color: '#DC2626' }
  ]
  
  return (
    <div className="relative py-12">
      {/* Timeline line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600" />
      
      {consequences.map((item, index) => (
        <motion.div
          key={item.year}
          className={`relative flex items-center gap-8 mb-12 ${
            index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
          }`}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
        >
          {/* Content card */}
          <motion.div
            className="flex-1 p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: `${item.color}20`, borderColor: item.color }}
            whileHover={{ scale: 1.05, boxShadow: `0 20px 40px ${item.color}40` }}
          >
            <h4 className="text-2xl font-bold mb-2" style={{ color: item.color }}>
              {item.year}
            </h4>
            <p className="text-lg font-semibold text-gray-800">{item.event}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: item.color }}>
              Impact: {item.impact}
            </span>
          </motion.div>
          
          {/* Timeline dot */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white"
            style={{ backgroundColor: item.color }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, type: 'spring' }}
          />
        </motion.div>
      ))}
    </div>
  )
}
```

---

### SECTION 3: SOLUTION INTRODUCTION - PARADIGM SHIFT VISUALIZATION

**1. Animated Transformation Sequence**
```typescript
// Visual transformation from chaos to order
const ParadigmShiftAnimation: React.FC = () => {
  const [stage, setStage] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="relative h-96 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="chaos"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute"
          >
            {/* Chaotic scattered elements */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-red-500 rounded-full"
                animate={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  scale: [1, 1.5, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            ))}
            <p className="text-2xl font-bold text-red-600 mt-64">Heuristic Chaos</p>
          </motion.div>
        )}
        
        {stage === 1 && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute"
          >
            {/* Processing animation */}
            <motion.div
              className="w-32 h-32 border-8 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-2xl font-bold text-blue-600 mt-8">Algorithmic Processing</p>
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div
            key="order"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute"
          >
            {/* Organized grid */}
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-8 h-8 bg-emerald-500 rounded"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05 }}
                />
              ))}
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-8">Rational Order</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```


**2. Interactive Algorithm Comparison Matrix**
```typescript
// Sortable, filterable comparison table with animations
const AlgorithmComparisonMatrix: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('accuracy')
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null)
  
  const algorithms = [
    { name: 'SAW/SMART', weight: 'Manual', bias: 'None', logic: 'Linear', outlier: 'Vulnerable', validation: false, accuracy: 68.64 },
    { name: 'Profile Matching', weight: 'Gap-based', bias: 'Low', logic: 'Gap Analysis', outlier: 'Moderate', validation: false, accuracy: 45 },
    { name: 'TOPSIS Pure', weight: 'Pre-defined', bias: 'None', logic: 'Geometric', outlier: 'Strong', validation: false, accuracy: 73 },
    { name: 'AHP-TOPSIS', weight: 'Eigenvector', bias: 'Very High', logic: 'Weighted Geometric', outlier: 'Very Strong', validation: true, accuracy: 95.71 }
  ]
  
  const sortedAlgorithms = [...algorithms].sort((a, b) => 
    sortBy === 'accuracy' ? b.accuracy - a.accuracy : a.name.localeCompare(b.name)
  )
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
            {['Algorithm', 'Weight Method', 'Bias Mitigation', 'Logic', 'Outlier Handling', 'Validation', 'Accuracy'].map((header, i) => (
              <motion.th
                key={header}
                className="px-6 py-4 text-left font-bold cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                onClick={() => header === 'Accuracy' && setSortBy('accuracy')}
              >
                {header}
                {header === 'Accuracy' && sortBy === 'accuracy' && (
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 180 }}
                    className="ml-2"
                  >
                    ↓
                  </motion.span>
                )}
              </motion.th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedAlgorithms.map((algo, index) => (
            <motion.tr
              key={algo.name}
              className={`border-b transition-all ${
                algo.name === 'AHP-TOPSIS' 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'hover:bg-gray-50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHighlightedRow(algo.name)}
              onMouseLeave={() => setHighlightedRow(null)}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            >
              <td className="px-6 py-4 font-bold">
                {algo.name}
                {algo.name === 'AHP-TOPSIS' && (
                  <motion.span
                    className="ml-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    BEST
                  </motion.span>
                )}
              </td>
              <td className="px-6 py-4">{algo.weight}</td>
              <td className="px-6 py-4">{algo.bias}</td>
              <td className="px-6 py-4">{algo.logic}</td>
              <td className="px-6 py-4">{algo.outlier}</td>
              <td className="px-6 py-4">
                {algo.validation ? (
                  <span className="text-emerald-600 text-2xl">✓</span>
                ) : (
                  <span className="text-red-600 text-2xl">✗</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        algo.accuracy > 90 ? 'bg-emerald-500' :
                        algo.accuracy > 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${algo.accuracy}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="font-bold text-lg">{algo.accuracy}%</span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```


---

### SECTION 4: METHODOLOGY DEEP DIVE - INTERACTIVE 6-PHASE JOURNEY

**1. Animated Phase Navigator**
```typescript
// Interactive phase-by-phase exploration
const MethodologyNavigator: React.FC = () => {
  const [activePhase, setActivePhase] = useState(1)
  
  const phases = [
    {
      number: 1,
      title: 'Profiling & Gap Analysis',
      icon: '🎯',
      duration: '15-20 min',
      color: '#3B82F6',
      description: 'Comprehensive psychometric assessment using RIASEC, Grit Scale, and adaptive logic testing'
    },
    {
      number: 2,
      title: 'AHP Pairwise Comparison',
      icon: '⚖️',
      duration: '5-10 min',
      color: '#8B5CF6',
      description: 'Structured preference elicitation using Saaty 1-9 scale with eigenvector extraction'
    },
    {
      number: 3,
      title: 'Consistency Validation',
      icon: '✓',
      duration: '< 1 sec',
      color: '#10B981',
      description: 'Mathematical audit ensuring logical coherence with CR < 0.1 threshold'
    },
    {
      number: 4,
      title: 'TOPSIS Normalization',
      icon: '📊',
      duration: '< 1 sec',
      color: '#F59E0B',
      description: 'Vector normalization and weighted matrix construction for multi-criteria evaluation'
    },
    {
      number: 5,
      title: 'Distance Calculation',
      icon: '📐',
      duration: '< 1 sec',
      color: '#EF4444',
      description: 'Euclidean distance computation to ideal positive and negative solutions'
    },
    {
      number: 6,
      title: 'Final Ranking',
      icon: '🏆',
      duration: '< 1 sec',
      color: '#EC4899',
      description: 'Closeness coefficient calculation and adaptive ranking generation'
    }
  ]
  
  return (
    <div className="space-y-12">
      {/* Phase selector */}
      <div className="flex justify-center gap-4 flex-wrap">
        {phases.map((phase) => (
          <motion.button
            key={phase.number}
            className={`relative px-6 py-4 rounded-xl font-bold transition-all ${
              activePhase === phase.number
                ? 'text-white shadow-2xl'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: activePhase === phase.number ? phase.color : undefined
            }}
            onClick={() => setActivePhase(phase.number)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl mr-2">{phase.icon}</span>
            Phase {phase.number}
            
            {activePhase === phase.number && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: phase.color }}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Phase content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative p-12 rounded-3xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: `${phases[activePhase - 1].color}10` }}
        >
          {/* Decorative background */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${phases[activePhase - 1].color}30` }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <motion.span
                className="text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {phases[activePhase - 1].icon}
              </motion.span>
              <div>
                <h3 className="text-4xl font-bold mb-2" style={{ color: phases[activePhase - 1].color }}>
                  {phases[activePhase - 1].title}
                </h3>
                <span className="text-gray-600 font-semibold">
                  Duration: {phases[activePhase - 1].duration}
                </span>
              </div>
            </div>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {phases[activePhase - 1].description}
            </p>
            
            {/* Phase-specific interactive demo */}
            {activePhase === 2 && <AHPPairwiseDemo />}
            {activePhase === 3 && <ConsistencyRatioMeter />}
            {activePhase === 5 && <DistanceVisualization3D />}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {phases.map((phase) => (
          <motion.div
            key={phase.number}
            className="h-2 rounded-full"
            style={{
              width: activePhase === phase.number ? '48px' : '12px',
              backgroundColor: activePhase >= phase.number ? phase.color : '#E5E7EB'
            }}
            animate={{
              width: activePhase === phase.number ? '48px' : '12px'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}
```


**2. Interactive AHP Pairwise Comparison Demo**
```typescript
// Live demo of pairwise comparison with real-time CR calculation
const AHPPairwiseDemo: React.FC = () => {
  const [comparisons, setComparisons] = useState<Record<string, number>>({
    'career_vs_cost': 5,
    'career_vs_academic': 3,
    'cost_vs_academic': 2
  })
  const [cr, setCR] = useState(0.05)
  
  const criteria = ['Career Prospects', 'Cost', 'Academic Fit']
  
  const handleSliderChange = (key: string, value: number) => {
    setComparisons({ ...comparisons, [key]: value })
    // Simulate CR calculation
    const randomCR = Math.random() * 0.15
    setCR(randomCR)
  }
  
  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        {Object.entries(comparisons).map(([key, value]) => {
          const [crit1, crit2] = key.split('_vs_')
          
          return (
            <motion.div
              key={key}
              className="p-6 bg-white rounded-xl shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg capitalize">{crit1.replace('_', ' ')}</span>
                <span className="text-gray-400">vs</span>
                <span className="font-bold text-lg capitalize">{crit2.replace('_', ' ')}</span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={value}
                  onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #3B82F6 0%, 
                      #8B5CF6 ${((value - 1) / 8) * 50}%, 
                      #10B981 ${((value - 1) / 8) * 100}%)`
                  }}
                />
                
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>1 (Equal)</span>
                  <motion.span
                    className="font-bold text-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    {value}
                  </motion.span>
                  <span>9 (Extreme)</span>
                </div>
              </div>
              
              <p className="mt-3 text-sm text-gray-600 italic">
                {value === 1 && 'Both criteria are equally important'}
                {value === 3 && 'First criterion is moderately more important'}
                {value === 5 && 'First criterion is strongly more important'}
                {value === 7 && 'First criterion is very strongly more important'}
                {value === 9 && 'First criterion is extremely more important'}
                {![1, 3, 5, 7, 9].includes(value) && 'Intermediate value between two judgments'}
              </p>
            </motion.div>
          )
        })}
      </div>
      
      {/* CR Meter */}
      <motion.div
        className="p-8 rounded-2xl"
        style={{
          backgroundColor: cr < 0.1 ? '#D1FAE520' : '#FEE2E220',
          borderWidth: '3px',
          borderColor: cr < 0.1 ? '#10B981' : '#EF4444'
        }}
        animate={{
          borderColor: cr < 0.1 ? '#10B981' : '#EF4444'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-bold">Consistency Ratio (CR)</h4>
          <motion.span
            className="text-4xl font-bold"
            style={{ color: cr < 0.1 ? '#10B981' : '#EF4444' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {cr.toFixed(3)}
          </motion.span>
        </div>
        
        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${(cr / 0.15) * 100}%`,
              backgroundColor: cr < 0.1 ? '#10B981' : '#EF4444'
            }}
            animate={{ width: `${(cr / 0.15) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Threshold marker */}
          <div className="absolute top-0 bottom-0 w-1 bg-black" style={{ left: '66.67%' }}>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap">
              Threshold: 0.1
            </span>
          </div>
        </div>
        
        <p className="mt-4 text-center font-semibold">
          {cr < 0.1 ? (
            <span className="text-emerald-600">✓ Consistent! Your judgments are logically coherent.</span>
          ) : (
            <span className="text-red-600">✗ Inconsistent. Please review your comparisons.</span>
          )}
        </p>
      </motion.div>
    </div>
  )
}
```


**3. 3D TOPSIS Distance Visualization**
```typescript
// Interactive 3D visualization of ideal solution distances
const DistanceVisualization3D: React.FC = () => {
  return (
    <div className="h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Ideal Positive Solution (Green Star) */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[3, 3, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial 
              color="#10B981" 
              emissive="#10B981" 
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
        
        {/* Ideal Negative Solution (Red Star) */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[-3, -3, 0]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial 
              color="#EF4444" 
              emissive="#EF4444" 
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
        
        {/* Alternative majors (scattered points) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 6
          const y = (Math.random() - 0.5) * 6
          const z = (Math.random() - 0.5) * 2
          
          return (
            <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2}>
              <mesh position={[x, y, z]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial 
                  color="#3B82F6" 
                  transparent 
                  opacity={0.7}
                />
              </mesh>
            </Float>
          )
        })}
        
        {/* Grid helper */}
        <gridHelper args={[10, 10, '#444444', '#222222']} />
        
        {/* Orbit controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-full" />
          <span>Ideal Positive (A+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
          <span>Alternatives</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
          <span>Ideal Negative (A-)</span>
        </div>
      </div>
    </div>
  )
}
```

---

### SECTION 5: SOCIAL PROOF - ANIMATED TESTIMONIALS

**1. Testimonial Carousel with Parallax**
```typescript
// Auto-playing testimonial carousel with depth effect
const TestimonialCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const testimonials = [
    {
      name: 'Rina Wijaya',
      role: 'Mahasiswa DKV',
      university: 'Universitas Indonesia',
      avatar: '/avatars/rina.jpg',
      quote: 'Saya hampir salah pilih jurusan karena ikut teman. MajorMind menunjukkan bahwa profil saya lebih cocok dengan jurusan lain. Sekarang saya sangat menikmati kuliah dan IPK saya 3.8!',
      rating: 5,
      color: '#EC4899'
    },
    {
      name: 'Bapak Hendra Kusuma, M.Pd.',
      role: 'Guru BK',
      university: 'SMK Negeri 1 Jakarta',
      avatar: '/avatars/hendra.jpg',
      quote: 'Sebagai konselor dengan 15 tahun pengalaman, saya akui bahwa MajorMind memberikan objektivitas yang tidak bisa saya berikan secara konsisten ke 200+ siswa.',
      rating: 5,
      color: '#3B82F6'
    },
    {
      name: 'Ibu Sari Lestari',
      role: 'Orang Tua Siswa',
      university: 'Jakarta',
      avatar: '/avatars/sari.jpg',
      quote: 'Investasi Rp 299.000 ini tidak ada apa-apanya dibanding risiko anak saya salah jurusan dan DO. Laporan yang diberikan sangat detail.',
      rating: 5,
      color: '#10B981'
    }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="relative h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 100, rotateY: -30 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -100, rotateY: 30 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div 
            className="relative max-w-4xl p-12 rounded-3xl shadow-2xl"
            style={{ backgroundColor: `${testimonials[activeIndex].color}10` }}
          >
            {/* Quote icon */}
            <motion.div
              className="absolute -top-6 -left-6 text-8xl opacity-20"
              style={{ color: testimonials[activeIndex].color }}
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              "
            </motion.div>
            
            {/* Avatar */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4"
              style={{ borderColor: testimonials[activeIndex].color }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img 
                src={testimonials[activeIndex].avatar} 
                alt={testimonials[activeIndex].name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Quote */}
            <p className="text-2xl text-gray-700 text-center leading-relaxed mb-6 italic">
              "{testimonials[activeIndex].quote}"
            </p>
            
            {/* Rating */}
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-3xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  ⭐
                </motion.span>
              ))}
            </div>
            
            {/* Author info */}
            <div className="text-center">
              <h4 className="text-xl font-bold" style={{ color: testimonials[activeIndex].color }}>
                {testimonials[activeIndex].name}
              </h4>
              <p className="text-gray-600">{testimonials[activeIndex].role}</p>
              <p className="text-gray-500 text-sm">{testimonials[activeIndex].university}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: index === activeIndex ? testimonials[activeIndex].color : '#D1D5DB'
            }}
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.5 }}
            animate={{
              scale: index === activeIndex ? 1.2 : 1
            }}
          />
        ))}
      </div>
    </div>
  )
}
```


**2. Real-Time Activity Feed**
```typescript
// Live activity notifications (simulated)
const LiveActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Array<{
    id: string
    name: string
    action: string
    time: string
    avatar: string
  }>>([])
  
  useEffect(() => {
    const names = ['Ahmad', 'Siti', 'Budi', 'Rina', 'Doni', 'Maya']
    const actions = [
      'baru saja menyelesaikan asesmen',
      'mendapat rekomendasi Teknik Informatika',
      'download PDF report',
      'bergabung dengan MajorMind',
      'memberikan rating 5 bintang'
    ]
    const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan']
    
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now().toString(),
        name: `${names[Math.floor(Math.random() * names.length)]} dari ${cities[Math.floor(Math.random() * cities.length)]}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        time: 'Baru saja',
        avatar: `/avatars/user${Math.floor(Math.random() * 10)}.jpg`
      }
      
      setActivities((prev) => [newActivity, ...prev].slice(0, 5))
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="fixed bottom-8 right-8 w-96 space-y-2 z-40">
      <AnimatePresence>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border-l-4 border-emerald-500"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-white font-bold">
                {activity.name.charAt(0)}
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {activity.name}
              </p>
              <p className="text-xs text-gray-600">{activity.action}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
            
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎉
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
```

**3. Animated Statistics Dashboard**
```typescript
// Impact statistics with animated counters
const ImpactStatistics: React.FC = () => {
  const stats = [
    { label: 'Siswa Terlayani', value: 10000, suffix: '+', icon: '👥', color: '#3B82F6' },
    { label: 'Akurasi Rekomendasi', value: 95.71, suffix: '%', icon: '🎯', color: '#10B981' },
    { label: 'Tingkat Kepuasan', value: 92, suffix: '%', icon: '⭐', color: '#F59E0B' },
    { label: 'Institusi Partner', value: 15, suffix: '+', icon: '🏫', color: '#EC4899' }
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="relative p-8 rounded-2xl overflow-hidden group cursor-pointer"
          style={{ backgroundColor: `${stat.color}10` }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -10 }}
        >
          {/* Background gradient on hover */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: stat.color }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
          />
          
          {/* Icon */}
          <motion.div
            className="text-5xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {stat.icon}
          </motion.div>
          
          {/* Counter */}
          <div className="relative z-10">
            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            <p className="text-gray-600 font-semibold mt-2">{stat.label}</p>
          </div>
          
          {/* Decorative circle */}
          <motion.div
            className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full"
            style={{ backgroundColor: `${stat.color}20` }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </motion.div>
      ))}
    </div>
  )
}
```

---

### SECTION 6: PRICING - INTERACTIVE PACKAGE CARDS

**1. Animated Pricing Cards with Hover Effects**
```typescript
// Premium pricing cards with 3D tilt effect
const PricingCards: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  const packages = [
    {
      id: 'free',
      name: 'FREE',
      subtitle: 'Eksplorasi Dasar',
      price: 0,
      features: [
        '1x asesmen lengkap',
        'Top 3 rekomendasi jurusan',
        'Basic reasoning explanation',
        'Akses database 100+ jurusan',
        'Community forum access'
      ],
      color: '#6B7280',
      popular: false
    },
    {
      id: 'student',
      name: 'STUDENT',
      subtitle: 'Paling Populer',
      price: 99000,
      features: [
        'Unlimited asesmen',
        'Top 10 rekomendasi detail',
        'Advanced comparison matrix',
        'Database 500+ jurusan',
        'PDF report download',
        'Email support',
        'Valid 1 tahun'
      ],
      color: '#3B82F6',
      popular: true
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      subtitle: 'Paket Lengkap',
      price: 299000,
      features: [
        'Semua fitur Student',
        '2x konsultasi video call',
        'Personalized career roadmap',
        'Scholarship matching',
        'Priority WhatsApp support',
        'Lifetime access',
        'Future updates gratis'
      ],
      color: '#10B981',
      popular: false
    }
  ]
  
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          onMouseEnter={() => setHoveredCard(pkg.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Popular badge */}
          {pkg.popular && (
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg z-10"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔥 PALING POPULER
            </motion.div>
          )}
          
          <motion.div
            className="relative p-8 rounded-3xl shadow-xl overflow-hidden"
            style={{
              backgroundColor: hoveredCard === pkg.id ? `${pkg.color}10` : 'white',
              borderWidth: '3px',
              borderColor: pkg.popular ? pkg.color : '#E5E7EB'
            }}
            animate={{
              scale: hoveredCard === pkg.id ? 1.05 : pkg.popular ? 1.05 : 1,
              y: hoveredCard === pkg.id ? -10 : pkg.popular ? -5 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Background decoration */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
              style={{ backgroundColor: `${pkg.color}20` }}
              animate={{
                scale: hoveredCard === pkg.id ? 1.5 : 1,
                rotate: hoveredCard === pkg.id ? 180 : 0
              }}
              transition={{ duration: 0.5 }}
            />
            
            <div className="relative z-10">
              {/* Package name */}
              <h3 className="text-3xl font-bold mb-2" style={{ color: pkg.color }}>
                {pkg.name}
              </h3>
              <p className="text-gray-600 mb-6">{pkg.subtitle}</p>
              
              {/* Price */}
              <div className="mb-8">
                {pkg.price === 0 ? (
                  <span className="text-5xl font-bold text-gray-800">GRATIS</span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-gray-600">Rp</span>
                    <AnimatedCounter end={pkg.price} suffix="" />
                  </div>
                )}
              </div>
              
              {/* Features */}
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                  >
                    <motion.span
                      className="text-2xl"
                      style={{ color: pkg.color }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    >
                      ✓
                    </motion.span>
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              
              {/* CTA Button */}
              <motion.button
                className="w-full py-4 rounded-xl font-bold text-white text-lg"
                style={{ backgroundColor: pkg.color }}
                whileHover={{ scale: 1.05, boxShadow: `0 20px 40px ${pkg.color}40` }}
                whileTap={{ scale: 0.95 }}
              >
                {pkg.price === 0 ? 'Mulai Gratis' : 'Pilih Paket Ini'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
```


---

### SECTION 7: FAQ - INTERACTIVE ACCORDION

**1. Animated FAQ Accordion**
```typescript
// Smooth accordion with search functionality
const InteractiveFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const faqs = [
    {
      question: 'Apakah sistem ini bisa 100% menjamin saya tidak akan menyesal?',
      answer: 'Tidak ada sistem yang bisa menjamin 100%, termasuk intuisi Anda sendiri. Yang kami jamin adalah: rekomendasi kami didasarkan pada 95.71% akurasi historis, validasi matematis ketat (CR<0.1), dan data objektif dari BAN-PT & Tracer Study.',
      category: 'Akurasi'
    },
    {
      question: 'Bagaimana jika saya tidak setuju dengan rekomendasi sistem?',
      answer: 'Sistem adalah decision support, bukan decision maker. Anda tetap pemegang keputusan final. Namun, kami sarankan untuk memahami reasoning di balik rekomendasi sebelum mengabaikannya.',
      category: 'Penggunaan'
    },
    {
      question: 'Apakah data saya aman?',
      answer: 'Sangat aman. Kami menggunakan enkripsi end-to-end, compliance dengan UU Perlindungan Data Pribadi, dan tidak pernah menjual data ke pihak ketiga.',
      category: 'Keamanan'
    },
    {
      question: 'Berapa lama proses asesmen?',
      answer: 'Total sekitar 50 menit untuk asesmen lengkap. Anda bisa pause dan resume kapan saja. Komputasi algoritma hanya butuh 30 detik.',
      category: 'Proses'
    },
    {
      question: 'Apakah sistem ini cocok untuk siswa SMA IPA/IPS juga?',
      answer: 'Absolut! Sistem dirancang untuk semua latar belakang: SMK, SMA IPA, SMA IPS, MA. Algoritma akan menyesuaikan kriteria evaluasi berdasarkan profil Anda.',
      category: 'Kompatibilitas'
    }
  ]
  
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Search bar */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
          />
          <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl">
            🔍
          </span>
        </div>
      </motion.div>
      
      {/* FAQ items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => {
          const isOpen = openIndex === index
          
          return (
            <motion.div
              key={index}
              className="border-2 border-gray-200 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ borderColor: '#3B82F6' }}
            >
              <motion.button
                className="w-full px-8 py-6 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                whileHover={{ backgroundColor: '#F3F4F6' }}
              >
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full mb-2">
                    {faq.category}
                  </span>
                  <h4 className="text-xl font-bold text-gray-800">
                    {faq.question}
                  </h4>
                </div>
                
                <motion.div
                  className="ml-4 text-3xl text-blue-600"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 py-6 bg-gray-50 border-t-2 border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
      
      {filteredFAQs.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-6xl mb-4 block">🤔</span>
          <p className="text-xl text-gray-600">
            Tidak ada pertanyaan yang cocok dengan pencarian Anda
          </p>
        </motion.div>
      )}
    </div>
  )
}
```

---

### SECTION 8: FINAL CTA - IMMERSIVE CONVERSION SECTION

**1. Multi-Layer CTA with Urgency**
```typescript
// Final conversion section with multiple psychological triggers
const FinalCTASection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 34,
    seconds: 56
  })
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-emerald-900">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            backgroundSize: ['100% 100%', '200% 200%']
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-8">
        {/* Headline */}
        <motion.h2
          className="text-5xl md:text-7xl font-bold text-white text-center mb-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Jangan Biarkan Masa Depan 4 Tahun Anda
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            Ditentukan oleh "Feeling"
          </span>
        </motion.h2>
        
        <motion.p
          className="text-2xl text-white/80 text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Lebih dari 10,000 siswa telah membuat keputusan yang lebih cerdas dengan MajorMind
        </motion.p>
        
        {/* Countdown timer */}
        <motion.div
          className="flex justify-center gap-6 mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <motion.div
                className="w-24 h-24 flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-4xl font-bold text-white">
                  {value.toString().padStart(2, '0')}
                </span>
              </motion.div>
              <p className="text-white/60 mt-2 capitalize">{unit}</p>
            </div>
          ))}
        </motion.div>
        
        <p className="text-center text-white/80 mb-8">
          ⏰ Pendaftaran PTN dibuka dalam waktu terbatas
        </p>
        
        {/* CTA buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
          <motion.button
            className="px-12 py-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xl font-bold rounded-2xl shadow-2xl"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-3">
              Mulai Asesmen Gratis
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
          
          <motion.button
            className="px-12 py-6 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white text-xl font-bold rounded-2xl"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            Lihat Demo 2 Menit
          </motion.button>
        </div>
        
        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>10,000+ siswa terlayani</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>95.71% akurasi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>30-hari money-back</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>15+ sekolah partner</span>
          </div>
        </div>
        
        {/* Risk reversal */}
        <motion.div
          className="mt-12 p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-white text-center text-lg">
            <span className="font-bold">Tidak puas?</span> Kami kembalikan 100% uang Anda dalam 30 hari. No questions asked.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
```


---

## 🎭 ADVANCED UI/UX PATTERNS

### 1. GLASSMORPHISM DESIGN SYSTEM

```typescript
// Reusable glass card component
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      className={`relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl ${className}`}
      whileHover={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.3)'
      }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// Usage example
<GlassCard className="p-8">
  <h3 className="text-2xl font-bold text-white mb-4">Glass Effect Card</h3>
  <p className="text-white/80">Beautiful glassmorphism design</p>
</GlassCard>
```

### 2. NEUMORPHISM ELEMENTS

```typescript
// Soft UI neumorphic button
const NeumorphicButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ 
  children, 
  onClick 
}) => {
  return (
    <motion.button
      className="px-8 py-4 rounded-2xl font-bold text-gray-700 transition-all"
      style={{
        background: '#e0e5ec',
        boxShadow: '9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)'
      }}
      whileHover={{
        boxShadow: 'inset 9px 9px 16px rgba(163, 177, 198, 0.6), inset -9px -9px 16px rgba(255, 255, 255, 0.5)'
      }}
      whileTap={{
        boxShadow: 'inset 6px 6px 12px rgba(163, 177, 198, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.5)'
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
```

### 3. GRADIENT MESH BACKGROUNDS

```typescript
// Animated gradient mesh
const GradientMeshBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }}>
              <animate attributeName="stop-color" values="#3B82F6; #8B5CF6; #10B981; #3B82F6" dur="10s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0.8 }}>
              <animate attributeName="stop-color" values="#10B981; #F59E0B; #EC4899; #10B981" dur="10s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grad1)" />
        
        <g filter="url(#goo)">
          <motion.circle
            cx="20%"
            cy="30%"
            r="15%"
            fill="#3B82F6"
            opacity="0.6"
            animate={{
              cx: ['20%', '80%', '20%'],
              cy: ['30%', '70%', '30%'],
              r: ['15%', '20%', '15%']
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <motion.circle
            cx="80%"
            cy="70%"
            r="20%"
            fill="#10B981"
            opacity="0.6"
            animate={{
              cx: ['80%', '20%', '80%'],
              cy: ['70%', '30%', '70%'],
              r: ['20%', '15%', '20%']
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          <motion.circle
            cx="50%"
            cy="50%"
            r="18%"
            fill="#8B5CF6"
            opacity="0.6"
            animate={{
              r: ['18%', '25%', '18%']
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      </svg>
    </div>
  )
}
```

### 4. MICRO-INTERACTIONS

```typescript
// Button with ripple effect
const RippleButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ 
  children, 
  onClick 
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setRipples([...ripples, { x, y, id: Date.now() }])
    
    setTimeout(() => {
      setRipples(ripples => ripples.slice(1))
    }, 600)
    
    onClick?.()
  }
  
  return (
    <button
      className="relative px-8 py-4 bg-blue-600 text-white font-bold rounded-xl overflow-hidden"
      onClick={handleClick}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute w-4 h-4 bg-white rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      
      {children}
    </button>
  )
}
```

### 5. PARALLAX SCROLLING

```typescript
// Parallax section with multiple layers
const ParallaxSection: React.FC = () => {
  const { scrollY } = useScroll()
  
  const y1 = useTransform(scrollY, [0, 1000], [0, -200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -100])
  const y3 = useTransform(scrollY, [0, 1000], [0, -50])
  
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background layer (slowest) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-900 to-purple-900"
        style={{ y: y1 }}
      />
      
      {/* Middle layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: y2 }}
      >
        <h2 className="text-6xl font-bold text-white/30">Background Text</h2>
      </motion.div>
      
      {/* Foreground layer (fastest) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: y3 }}
      >
        <div className="text-center">
          <h1 className="text-7xl font-bold text-white mb-4">Parallax Effect</h1>
          <p className="text-2xl text-white/80">Scroll to see the magic</p>
        </div>
      </motion.div>
    </div>
  )
}
```

### 6. LOADING STATES & SKELETON SCREENS

```typescript
// Skeleton loader for content
const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-4/6" />
      
      <div className="grid grid-cols-3 gap-4 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

// Animated loading spinner
const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
```


---

## 🎮 GAMIFICATION & INTERACTIVE STORYTELLING

### 1. PROGRESS TRACKING SYSTEM

```typescript
// User journey progress tracker
const JourneyProgressTracker: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  
  const steps = [
    { id: 1, name: 'Discovery', icon: '🔍', completed: true },
    { id: 2, name: 'Assessment', icon: '📝', completed: true },
    { id: 3, name: 'Results', icon: '📊', completed: false },
    { id: 4, name: 'Decision', icon: '🎯', completed: false }
  ]
  
  return (
    <div className="relative py-12">
      {/* Progress line */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>
      
      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setCurrentStep(step.id)}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                step.completed || currentStep >= step.id
                  ? 'bg-gradient-to-br from-blue-500 to-emerald-500 border-white text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
              animate={{
                scale: currentStep === step.id ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 1, repeat: currentStep === step.id ? Infinity : 0 }}
            >
              {step.icon}
            </motion.div>
            
            <p className={`mt-3 font-semibold ${
              currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {step.name}
            </p>
            
            {step.completed && (
              <motion.div
                className="mt-1 text-emerald-500 text-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

### 2. ACHIEVEMENT BADGES

```typescript
// Unlockable achievement system
const AchievementBadge: React.FC<{ 
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress?: number
}> = ({ title, description, icon, unlocked, progress = 0 }) => {
  return (
    <motion.div
      className={`relative p-6 rounded-2xl ${
        unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-200'
      }`}
      whileHover={{ scale: 1.05, rotate: unlocked ? [0, -5, 5, 0] : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Lock overlay for locked badges */}
      {!unlocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <span className="text-6xl">🔒</span>
        </div>
      )}
      
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={unlocked ? {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.div>
        
        <h4 className={`text-xl font-bold mb-2 ${unlocked ? 'text-white' : 'text-gray-600'}`}>
          {title}
        </h4>
        
        <p className={`text-sm ${unlocked ? 'text-white/80' : 'text-gray-500'}`}>
          {description}
        </p>
        
        {!unlocked && progress > 0 && (
          <div className="mt-4">
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">{progress}% Complete</p>
          </div>
        )}
      </div>
      
      {unlocked && (
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  )
}

// Achievement showcase
const AchievementShowcase: React.FC = () => {
  const achievements = [
    { title: 'First Steps', description: 'Complete your first assessment', icon: '🎯', unlocked: true },
    { title: 'Consistency Master', description: 'Achieve CR < 0.05', icon: '⚖️', unlocked: true },
    { title: 'Explorer', description: 'Try 5 different scenarios', icon: '🔍', unlocked: false, progress: 60 },
    { title: 'Decision Maker', description: 'Make your final choice', icon: '🏆', unlocked: false, progress: 0 }
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <AchievementBadge {...achievement} />
        </motion.div>
      ))}
    </div>
  )
}
```

### 3. INTERACTIVE STORYTELLING

```typescript
// Story-driven onboarding
const InteractiveStory: React.FC = () => {
  const [scene, setScene] = useState(0)
  
  const story = [
    {
      background: 'bg-gradient-to-br from-red-900 to-orange-900',
      character: '😰',
      text: 'Meet Sarah. She\'s confused about choosing her major...',
      choices: [
        { text: 'Follow friends', next: 1 },
        { text: 'Use MajorMind', next: 2 }
      ]
    },
    {
      background: 'bg-gradient-to-br from-gray-800 to-gray-900',
      character: '😔',
      text: 'Sarah followed her friends. After 2 years, she dropped out. Lost time and money.',
      choices: [
        { text: 'Start over', next: 0 }
      ]
    },
    {
      background: 'bg-gradient-to-br from-emerald-600 to-blue-600',
      character: '😊',
      text: 'Sarah used MajorMind. She found her perfect match and is now thriving with a 3.8 GPA!',
      choices: [
        { text: 'Be like Sarah', next: 3 }
      ]
    },
    {
      background: 'bg-gradient-to-br from-purple-600 to-pink-600',
      character: '🎓',
      text: 'Your turn! Start your journey to the perfect major.',
      choices: [
        { text: 'Start Assessment', next: -1 }
      ]
    }
  ]
  
  const currentScene = story[scene]
  
  return (
    <motion.div
      className={`relative h-screen flex items-center justify-center ${currentScene.background}`}
      key={scene}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-2xl mx-auto text-center px-8">
        <motion.div
          className="text-9xl mb-8"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentScene.character}
        </motion.div>
        
        <motion.p
          className="text-3xl text-white mb-12 leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentScene.text}
        </motion.p>
        
        <div className="flex flex-col gap-4">
          {currentScene.choices.map((choice, index) => (
            <motion.button
              key={index}
              className="px-8 py-4 bg-white text-gray-800 font-bold rounded-xl text-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, backgroundColor: '#F3F4F6' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (choice.next === -1) {
                  // Start assessment
                  window.location.href = '/assessment'
                } else {
                  setScene(choice.next)
                }
              }}
            >
              {choice.text}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
```


---

## 📱 MOBILE-FIRST RESPONSIVE ANIMATIONS

### 1. MOBILE NAVIGATION MENU

```typescript
// Animated mobile hamburger menu
const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  }
  
  const menuItems = [
    { name: 'Home', icon: '🏠', href: '#home' },
    { name: 'Features', icon: '✨', href: '#features' },
    { name: 'Methodology', icon: '🔬', href: '#methodology' },
    { name: 'Pricing', icon: '💰', href: '#pricing' },
    { name: 'FAQ', icon: '❓', href: '#faq' }
  ]
  
  return (
    <>
      {/* Hamburger button */}
      <motion.button
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex flex-col items-center justify-center gap-1.5 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span
          className="w-6 h-0.5 bg-gray-800"
          animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
        />
        <motion.span
          className="w-6 h-0.5 bg-gray-800"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        />
        <motion.span
          className="w-6 h-0.5 bg-gray-800"
          animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
        />
      </motion.button>
      
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Menu */}
      <motion.div
        className="fixed top-0 right-0 bottom-0 w-80 bg-gradient-to-br from-blue-600 to-emerald-600 z-40 p-8"
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="mt-20 space-y-6">
          {menuItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 text-white text-xl font-bold"
              initial={{ opacity: 0, x: 50 }}
              animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 10 }}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-3xl">{item.icon}</span>
              {item.name}
            </motion.a>
          ))}
        </div>
        
        <motion.button
          className="absolute bottom-8 left-8 right-8 py-4 bg-white text-blue-600 font-bold rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Assessment
        </motion.button>
      </motion.div>
    </>
  )
}
```

### 2. SWIPEABLE CARDS

```typescript
// Tinder-style swipeable cards for mobile
const SwipeableCards: React.FC = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Teknik Informatika', match: 95, color: '#3B82F6' },
    { id: 2, title: 'Sistem Informasi', match: 88, color: '#10B981' },
    { id: 3, title: 'Desain Komunikasi Visual', match: 82, color: '#F59E0B' }
  ])
  
  const handleSwipe = (direction: 'left' | 'right', cardId: number) => {
    setCards(cards.filter(card => card.id !== cardId))
  }
  
  return (
    <div className="relative h-96 flex items-center justify-center">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute w-80 h-96 rounded-3xl shadow-2xl p-8 flex flex-col justify-between"
          style={{
            backgroundColor: card.color,
            zIndex: cards.length - index
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (Math.abs(info.offset.x) > 100) {
              handleSwipe(info.offset.x > 0 ? 'right' : 'left', card.id)
            }
          }}
          animate={{
            scale: 1 - index * 0.05,
            y: index * 20
          }}
        >
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">{card.title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-bold text-white">{card.match}%</span>
              <span className="text-white/80">Match</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <motion.button
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-3xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✗
            </motion.button>
            
            <motion.button
              className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-3xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✓
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
```

### 3. PULL-TO-REFRESH

```typescript
// Pull-to-refresh interaction
const PullToRefresh: React.FC<{ onRefresh: () => Promise<void> }> = ({ onRefresh }) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleDragEnd = async () => {
    if (pullDistance > 100 && !isRefreshing) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    setPullDistance(0)
  }
  
  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDrag={(e, info) => {
        if (info.offset.y > 0) {
          setPullDistance(info.offset.y)
        }
      }}
      onDragEnd={handleDragEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
        animate={{
          y: Math.min(pullDistance, 100),
          opacity: pullDistance > 0 ? 1 : 0
        }}
      >
        <motion.div
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white"
          animate={{
            rotate: isRefreshing ? 360 : pullDistance * 3.6
          }}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        >
          {isRefreshing ? '⟳' : '↓'}
        </motion.div>
      </motion.div>
      
      {/* Content */}
      <div className="p-8">
        <p className="text-center text-gray-600">Pull down to refresh</p>
      </div>
    </motion.div>
  )
}
```

---

## 🎬 VIDEO & LOTTIE ANIMATIONS

### 1. HERO VIDEO BACKGROUND

```typescript
// Auto-playing hero video with overlay
const HeroVideoBackground: React.FC = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-7xl font-bold text-white mb-6">
            Your Future Starts Here
          </h1>
          <p className="text-2xl text-white/80 mb-12">
            Make the right choice with AI-powered guidance
          </p>
          <GlassCTAButton text="Start Your Journey" onClick={() => {}} />
        </motion.div>
      </div>
    </div>
  )
}
```

### 2. LOTTIE ANIMATIONS

```typescript
// Lottie animation integration
const LottieAnimation: React.FC<{ animationData: any; className?: string }> = ({ 
  animationData, 
  className = '' 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </motion.div>
  )
}

// Usage examples
const AnimatedIllustrations: React.FC = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <LottieAnimation 
        animationData={require('./animations/data-analysis.json')} 
        className="w-64 h-64"
      />
      <LottieAnimation 
        animationData={require('./animations/success.json')} 
        className="w-64 h-64"
      />
      <LottieAnimation 
        animationData={require('./animations/graduation.json')} 
        className="w-64 h-64"
      />
    </div>
  )
}
```


---

## 🔔 NOTIFICATION & FEEDBACK SYSTEMS

### 1. TOAST NOTIFICATIONS

```typescript
// Animated toast notification system
const Toast: React.FC<{
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
}> = ({ message, type, onClose }) => {
  const colors = {
    success: { bg: '#10B981', icon: '✓' },
    error: { bg: '#EF4444', icon: '✗' },
    info: { bg: '#3B82F6', icon: 'ℹ' },
    warning: { bg: '#F59E0B', icon: '⚠' }
  }
  
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])
  
  return (
    <motion.div
      className="fixed top-8 right-8 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl text-white"
      style={{ backgroundColor: colors[type].bg }}
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) onClose()
      }}
    >
      <motion.span
        className="text-3xl"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {colors[type].icon}
      </motion.span>
      
      <p className="font-semibold">{message}</p>
      
      <motion.button
        className="ml-4 text-2xl"
        onClick={onClose}
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        ×
      </motion.button>
    </motion.div>
  )
}

// Toast manager
const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<Array<{
    id: number
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
  }>>([])
  
  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToasts([...toasts, { id: Date.now(), message, type }])
  }
  
  const removeToast = (id: number) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }
  
  return (
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          style={{ top: `${8 + index * 80}px` }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
```

### 2. PROGRESS INDICATORS

```typescript
// Circular progress indicator
const CircularProgress: React.FC<{ 
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3B82F6' 
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {progress}%
        </motion.span>
      </div>
    </div>
  )
}

// Linear progress bar with label
const LinearProgress: React.FC<{
  progress: number
  label?: string
  color?: string
}> = ({ progress, label, color = '#3B82F6' }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          <span className="text-sm font-bold" style={{ color }}>{progress}%</span>
        </div>
      )}
      
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  )
}
```

### 3. FORM VALIDATION FEEDBACK

```typescript
// Animated form input with validation
const AnimatedInput: React.FC<{
  label: string
  value: string
  onChange: (value: string) => void
  validation?: (value: string) => { valid: boolean; message?: string }
}> = ({ label, value, onChange, validation }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message?: string }>({ valid: true })
  
  const handleBlur = () => {
    setIsFocused(false)
    if (validation) {
      setValidationResult(validation(value))
    }
  }
  
  return (
    <div className="relative">
      <motion.label
        className={`absolute left-4 transition-all pointer-events-none ${
          isFocused || value
            ? 'top-2 text-xs'
            : 'top-1/2 -translate-y-1/2 text-base'
        }`}
        style={{
          color: !validationResult.valid ? '#EF4444' : isFocused ? '#3B82F6' : '#6B7280'
        }}
        animate={{
          y: isFocused || value ? 0 : 0,
          scale: isFocused || value ? 0.85 : 1
        }}
      >
        {label}
      </motion.label>
      
      <motion.input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`w-full px-4 pt-6 pb-2 border-2 rounded-xl outline-none transition-all ${
          !validationResult.valid
            ? 'border-red-500'
            : isFocused
            ? 'border-blue-500'
            : 'border-gray-300'
        }`}
        animate={{
          borderColor: !validationResult.valid ? '#EF4444' : isFocused ? '#3B82F6' : '#D1D5DB'
        }}
      />
      
      <AnimatePresence>
        {!validationResult.valid && validationResult.message && (
          <motion.p
            className="mt-2 text-sm text-red-500 flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span>⚠</span>
            {validationResult.message}
          </motion.p>
        )}
      </AnimatePresence>
      
      {validationResult.valid && value && (
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 text-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
        >
          ✓
        </motion.div>
      )}
    </div>
  )
}
```

---

## 🎨 ADVANCED CHART ANIMATIONS

### 1. ANIMATED RADAR CHART

```typescript
// Interactive radar chart with animations
const AnimatedRadarChart: React.FC<{
  data: Array<{ label: string; value: number; max: number }>
}> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const size = 400
  const center = size / 2
  const radius = size / 2 - 60
  const angleStep = (Math.PI * 2) / data.length
  
  const points = data.map((item, index) => {
    const angle = angleStep * index - Math.PI / 2
    const distance = (item.value / item.max) * radius
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
      labelX: center + Math.cos(angle) * (radius + 40),
      labelY: center + Math.sin(angle) * (radius + 40)
    }
  })
  
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  
  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid circles */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <motion.circle
          key={i}
          cx={center}
          cy={center}
          r={radius * scale}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
      
      {/* Axis lines */}
      {data.map((item, index) => {
        const angle = angleStep * index - Math.PI / 2
        const endX = center + Math.cos(angle) * radius
        const endY = center + Math.sin(angle) * radius
        
        return (
          <motion.line
            key={index}
            x1={center}
            y1={center}
            x2={endX}
            y2={endY}
            stroke="#E5E7EB"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
          />
        )
      })}
      
      {/* Data polygon */}
      <motion.path
        d={pathData}
        fill="rgba(59, 130, 246, 0.3)"
        stroke="#3B82F6"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
      
      {/* Data points */}
      {points.map((point, index) => (
        <g key={index}>
          <motion.circle
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === index ? 8 : 6}
            fill="#3B82F6"
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + index * 0.05, type: 'spring' }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Labels */}
          <motion.text
            x={point.labelX}
            y={point.labelY}
            textAnchor="middle"
            className="text-sm font-semibold fill-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 + index * 0.05 }}
          >
            {data[index].label}
          </motion.text>
          
          {/* Value on hover */}
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                className="text-xs font-bold fill-blue-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {data[index].value}
              </motion.text>
            )}
          </AnimatePresence>
        </g>
      ))}
    </svg>
  )
}
```


### 2. ANIMATED WATERFALL CHART

```typescript
// Waterfall chart showing contribution breakdown
const AnimatedWaterfallChart: React.FC<{
  data: Array<{ label: string; value: number }>
}> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  let cumulative = 50 // Starting base score
  const bars = data.map((item, index) => {
    const start = cumulative
    cumulative += item.value
    return {
      label: item.label,
      value: item.value,
      start,
      end: cumulative,
      isPositive: item.value >= 0
    }
  })
  
  const maxValue = Math.max(...bars.map(b => b.end))
  const scale = 300 / maxValue
  
  return (
    <div className="w-full">
      <svg width="100%" height="400" className="overflow-visible">
        {bars.map((bar, index) => {
          const x = index * 120 + 50
          const barHeight = Math.abs(bar.value) * scale
          const y = bar.isPositive ? 400 - bar.end * scale : 400 - bar.start * scale
          
          return (
            <g key={index}>
              {/* Connector line */}
              {index > 0 && (
                <motion.line
                  x1={x - 70}
                  y1={400 - bars[index - 1].end * scale}
                  x2={x}
                  y2={400 - bar.start * scale}
                  stroke="#D1D5DB"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: index * 0.2 }}
                />
              )}
              
              {/* Bar */}
              <motion.rect
                x={x}
                y={y}
                width="60"
                height={barHeight}
                fill={bar.isPositive ? '#10B981' : '#EF4444'}
                rx="4"
                initial={{ height: 0, y: 400 }}
                animate={{ height: barHeight, y }}
                transition={{ delay: index * 0.2, type: 'spring' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Value label */}
              <motion.text
                x={x + 30}
                y={y - 10}
                textAnchor="middle"
                className="text-sm font-bold"
                fill={bar.isPositive ? '#10B981' : '#EF4444'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                {bar.value > 0 ? '+' : ''}{bar.value}
              </motion.text>
              
              {/* Axis label */}
              <motion.text
                x={x + 30}
                y={420}
                textAnchor="middle"
                className="text-xs fill-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                {bar.label}
              </motion.text>
              
              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <rect
                      x={x - 40}
                      y={y - 60}
                      width="140"
                      height="40"
                      fill="white"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                      rx="8"
                    />
                    <text
                      x={x + 30}
                      y={y - 35}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-gray-700"
                    >
                      Total: {bar.end.toFixed(1)}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### 1. LAZY LOADING COMPONENTS

```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react'

const Heavy3DVisualization = lazy(() => import('./Heavy3DVisualization'))
const ComplexChart = lazy(() => import('./ComplexChart'))
const VideoPlayer = lazy(() => import('./VideoPlayer'))

const OptimizedSection: React.FC = () => {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Heavy3DVisualization />
    </Suspense>
  )
}
```

### 2. INTERSECTION OBSERVER FOR ANIMATIONS

```typescript
// Only animate when in viewport
const useInViewAnimation = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return { ref, isInView }
}

// Usage
const AnimatedSection: React.FC = () => {
  const { ref, isInView } = useInViewAnimation()
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <h2>This animates only when visible</h2>
    </motion.div>
  )
}
```

### 3. IMAGE OPTIMIZATION

```typescript
// Progressive image loading with blur placeholder
const OptimizedImage: React.FC<{
  src: string
  alt: string
  className?: string
}> = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Actual image */}
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1-2)
- [ ] Setup Next.js 14 with TypeScript
- [ ] Install animation libraries (Framer Motion, GSAP, Three.js)
- [ ] Configure TailwindCSS with custom theme
- [ ] Setup project structure and routing
- [ ] Implement base layout and navigation

### Phase 2: Hero & Core Sections (Week 3-4)
- [ ] Animated hero section with gradient mesh
- [ ] Floating 3D elements
- [ ] Magnetic cursor effect
- [ ] Smooth scroll implementation
- [ ] Problem statement with interactive visualizations

### Phase 3: Methodology & Interactive Demos (Week 5-6)
- [ ] 6-phase methodology navigator
- [ ] Interactive AHP pairwise comparison demo
- [ ] 3D TOPSIS distance visualization
- [ ] Consistency ratio meter
- [ ] Algorithm comparison matrix

### Phase 4: Social Proof & Testimonials (Week 7)
- [ ] Animated testimonial carousel
- [ ] Real-time activity feed
- [ ] Impact statistics dashboard
- [ ] Achievement badges system
- [ ] Interactive storytelling

### Phase 5: Pricing & CTA (Week 8)
- [ ] Animated pricing cards
- [ ] Interactive FAQ accordion
- [ ] Final CTA section with countdown
- [ ] Toast notification system
- [ ] Form validation with animations

### Phase 6: Mobile Optimization (Week 9)
- [ ] Mobile navigation menu
- [ ] Swipeable cards
- [ ] Pull-to-refresh
- [ ] Touch-optimized interactions
- [ ] Responsive animations

### Phase 7: Performance & Polish (Week 10)
- [ ] Lazy loading implementation
- [ ] Image optimization
- [ ] Code splitting
- [ ] Performance testing (Lighthouse 90+)
- [ ] Cross-browser testing

### Phase 8: Testing & Launch (Week 11-12)
- [ ] User acceptance testing
- [ ] A/B testing setup
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Production deployment

---

## 🎯 SUCCESS METRICS

### Performance Targets
- Lighthouse Performance Score: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

### Engagement Targets
- Average Time on Page: > 5 minutes
- Scroll Depth: > 80%
- Interaction Rate: > 40%
- Bounce Rate: < 30%

### Conversion Targets
- CTA Click Rate: > 20%
- Assessment Start Rate: > 15%
- Sign-up Conversion: > 8%
- Mobile Conversion: > 5%

---

## 🎨 DESIGN TOKENS

```typescript
// Design system configuration
export const designTokens = {
  colors: {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      500: '#3B82F6',
      600: '#2563EB',
      900: '#1E3A8A'
    },
    secondary: {
      50: '#D1FAE5',
      500: '#10B981',
      600: '#059669'
    },
    accent: {
      500: '#F59E0B',
      600: '#D97706'
    },
    danger: {
      500: '#EF4444',
      600: '#DC2626'
    }
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem'
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Poppins', 'sans-serif']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem'
    }
  },
  
  animation: {
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s',
      slower: '1s'
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  }
}
```

---

## 📚 CONCLUSION

This ultra-advanced landing page enhancement prompt provides:

✅ **Complete Animation Framework** - Framer Motion, GSAP, Three.js integration
✅ **Modern UI Patterns** - Glassmorphism, neumorphism, gradient meshes
✅ **Interactive Demos** - AHP comparison, 3D TOPSIS, live calculators
✅ **Micro-Interactions** - Magnetic cursor, ripple effects, hover states
✅ **Gamification** - Progress tracking, achievements, storytelling
✅ **Mobile-First** - Responsive animations, touch interactions
✅ **Performance Optimized** - Lazy loading, intersection observers
✅ **Production Ready** - Complete implementation checklist

**Total Development Time**: 10-12 weeks
**Team Size**: 2-3 developers (1 frontend lead, 1 animation specialist, 1 designer)
**Budget Estimate**: $15,000 - $25,000 for full implementation

This landing page will be a **showcase of modern web development**, combining cutting-edge animations with solid UX principles to create an unforgettable user experience that drives conversions and establishes MajorMind as the premium choice for educational decision support.

