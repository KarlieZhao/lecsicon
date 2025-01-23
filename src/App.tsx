import { useRef, useEffect, useState } from 'react'
import banner from '/banner.png'
import { useWindowHeight } from './components/resize'
import './App.css'
import GeneratorSection from './components/generator'
import WordDisplay from './components/wordDisplay'

function App() {
  const bannerRef = useRef<HTMLImageElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(500);
  const windowHeight = useWindowHeight();
  const [maxHeight, setMaxHeight] = useState(windowHeight - bannerHeight - 25);
  const [logoHover, setLogoHover] = useState(false);

  useEffect(() => {
    if (bannerRef.current)
      setBannerHeight(bannerRef.current.getBoundingClientRect().height);
    if (collectionRef.current) {
      const calculatedMaxHeight = windowHeight - bannerHeight - 25;
      setMaxHeight(calculatedMaxHeight);
      // console.log(calculatedMaxHeight)
      collectionRef.current.style.height = `${calculatedMaxHeight}px`
    }
  }, [bannerHeight, windowHeight])

  return (
    <>
      <div className='background'>
        <div
          onMouseOver={() => { setLogoHover(true) }}
          onMouseOut={() => { setLogoHover(false) }} >
          <img src={banner} ref={bannerRef} className={`banner ${logoHover ? "blur" : null}`} alt="" />
          <div className={`acrostic ${logoHover ? "visible" : "invisible"}`}>
            <span className='text-highlight'>An acrostic is a poem or other word composition in which the first letter of each new line spells out a word, message or the alphabet.
            </span> </div>
        </div>

        <div className='top-box'>Prompt & Code</div>
        <div className='bottom-box'>
          <div style={{ marginLeft: "3rem" }}>Lecsicon is a growing collection of over 24,000 acrostic lines. </div>
          <div className='read-more'> Read More</div>
        </div>
        <div className='left-box'></div>
        <div className='right-box'></div>
      </div >

      <div className='collection' ref={collectionRef}>
        <h1>From the Collection</h1>
        <WordDisplay maxHeight={maxHeight} />
      </div>
      <GeneratorSection />
    </>
  )
}

export default App
