import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import Slider from '../components/Slider';

const Container = styled.div`
display: flex;
width: 100%;
min-height: 100vh;
`;

const ImageContainer = styled.div`
width: 80%;
display: flex;
justify-content: center;
align-items: center;
position: relative;

.drop-zone__canvas {
position:absolute;
}

.drop-zone__text{
padding: 20rem;
border: black 1.5px dashed;
}
`;

const newValuesRatioKeeper = (innerSide1, innerSide2, outerSide) => {
  const scaleValue = Math.min(outerSide / innerSide1, 1);
  return [innerSide1 * scaleValue, innerSide2 * scaleValue];
};

const adjustImageSize = (dropZoneElement, canvasElement) => {
  const dropZoneValues = getComputedStyle(dropZoneElement);
  const dropZoneWidth = parseFloat(dropZoneValues.getPropertyValue('width').replace('px', ''));
  const dropZoneHeight = parseFloat(dropZoneValues.getPropertyValue('height').replace('px', ''));
  const canvas = canvasElement;

  const [width, height] = newValuesRatioKeeper(canvas.width, canvas.height, dropZoneWidth);
  const [newHeight, newWidth] = newValuesRatioKeeper(height, width, dropZoneHeight);

  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
};

const useStateRef = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
};

const Home = () => {
  const dropZoneRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [filterString, setFilterString, filterStringRef] = useStateRef('');

  const applyCanvasFilters = () => {
    if (!imageRef.current || !imageRef.current.src) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.filter = filterStringRef.current;
    ctx.drawImage(imageRef.current, 0, 0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const { dataTransfer: { items: [file] } } = e;
    const reader = new FileReader();

    reader.onload = () => {
      imageRef.current.src = reader.result;
      const canvas = canvasRef.current;
      canvas.width = imageRef.current.width;
      canvas.height = imageRef.current.height;
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;
    };

    reader.readAsDataURL(file.getAsFile());
  };

  useEffect(() => {
    const resizeCanvas = () => {
      adjustImageSize(dropZoneRef.current, canvasRef.current);
      applyCanvasFilters();
    };

    imageRef.current = new Image();
    imageRef.current.onload = resizeCanvas;
    const canvasResizer = new ResizeObserver(resizeCanvas);
    canvasResizer.observe(dropZoneRef.current);

    return () => canvasResizer.disconnect();
  }, []);

  useEffect(() => {
    applyCanvasFilters();
  }, [filterString]);

  return (
    <Container>
      <Slider setFilterString={setFilterString} />
      <ImageContainer
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragEnter={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        <canvas className="drop-zone__canvas" width="0" height="0" ref={canvasRef} />
        {(imageRef.current && !imageRef.current.src) && <span className="drop-zone__text">Drop Your Image Here</span> }
      </ImageContainer>
    </Container>
  );
};

export default Home;
