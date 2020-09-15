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

function adjustImageSize(dropZoneElement, ImageElement, canvasElement) {
  const dropZoneValues = getComputedStyle(dropZoneElement);
  const dropZoneWidth = parseFloat(dropZoneValues.getPropertyValue('width').replace('px', ''));
  const dropZoneHeight = parseFloat(dropZoneValues.getPropertyValue('height').replace('px', ''));
  const canvas = canvasElement;
  let scaleValue;

  canvas.width = ImageElement.width;
  canvas.height = ImageElement.height;

  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;

  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;

  if (canvasWidth > dropZoneWidth) {
    scaleValue = dropZoneWidth / canvasWidth;
    const newWidth = canvasWidth * scaleValue;
    const newHeight = canvasHeight * scaleValue;
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    canvasWidth = newWidth;
    canvasHeight = newHeight;
  }

  if (canvasHeight > dropZoneHeight) {
    scaleValue = dropZoneHeight / canvasHeight;
    const newWidth = canvasWidth * scaleValue;
    const newHeight = canvasHeight * scaleValue;
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
  }
}

function useStateRef(initialValue) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
}

export default function Home() {
  const dropZoneRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [filterString, setFilterString, filterStringRef] = useStateRef('');

  function applyCanvasFilters() {
    if (!imageRef.current || !imageRef.current.src) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.filter = filterStringRef.current;
    ctx.drawImage(imageRef.current, 0, 0);
  }

  useEffect(() => {
    const dropZone = dropZoneRef.current;

    const handleDrop = (e) => {
      e.preventDefault();
      const { dataTransfer: { items: [file] } } = e;
      const reader = new FileReader();
      reader.onload = () => { imageRef.current.src = reader.result; };
      reader.readAsDataURL(file.getAsFile());
    };
    const handleDragOver = (e) => e.preventDefault();
    const handleDragIn = (e) => e.preventDefault();
    const handleDragOut = (e) => e.preventDefault();

    dropZone.addEventListener('dragenter', handleDragIn);
    dropZone.addEventListener('dragleave', handleDragOut);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragenter', handleDragIn);
      dropZone.removeEventListener('dragleave', handleDragOut);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      adjustImageSize(dropZoneRef.current, imageRef.current, canvasRef.current);
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
      <ImageContainer ref={dropZoneRef}>
        <canvas className="drop-zone__canvas" width="0" height="0" ref={canvasRef} />
        {(imageRef.current && !imageRef.current.src) && <span className="drop-zone__text">Drop Your Image Here</span> }
      </ImageContainer>
    </Container>
  );
}
