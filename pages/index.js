import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import Slider from '../components/Slider';

const Container = styled.div`
display: flex;
width: 100%;
height: 100%;
min-height: 100vh;
justify-content: space-evenly;
align-items: center;
  @media only screen and (max-width: 768px) {
  flex-direction: column-reverse;
  }
`;

const ImageContainer = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
align-items: center;
position: relative;

.drop-zone__text{
padding: 20rem;
border: black 1.5px dashed;
}
`;

const Sidebar = styled.section`
height: 100%;
width: 270rem;
display: flex;
flex-direction: column;
align-items: center;
padding: 20rem;
justify-content: center;
`;

const downloadButtonColor = '#4141ff';

const DownloadButton = styled.a`
  background-color: white;
  padding: 10rem;
  border: 2px solid ${downloadButtonColor};
  outline: none;
  color: ${downloadButtonColor};
  border-radius: 5rem;
  margin-top: 20rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 14rem;
  transition: all ease-in-out 0.2s;
  
&:hover {
background-color: ${downloadButtonColor};
color: white;
}
`;

const selectButtonColor = '#030303';

const SelectFileButton = styled.button`
  background-color: white;
  padding: 0.2em 0.2em;
  border: 2px solid ${selectButtonColor};
  outline: none;
  color: ${selectButtonColor};
  border-radius: 5rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 14rem;
  transition: all ease-in-out 0.2s;
  &:hover {
    background-color: ${selectButtonColor};
    color: white;
  }
  
`;

const newValuesRatioKeeper = (innerSide1, innerSide2, outerSide) => {
  const scaleValue = Math.min(outerSide / innerSide1, 1);
  return [innerSide1 * scaleValue, innerSide2 * scaleValue];
};

function initCanvasSize(canvasElement, imageElement) {
  canvasElement.width = imageElement.width;
  canvasElement.height = imageElement.height;
}

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

const DropOrSelectFile = React.forwardRef(({ handleChooseFileClick, handleSelectFile }, ref) => (
  <div>
    <span className="drop-zone__text">
      Drop Your Image Here or
      {' '}
      <SelectFileButton onClick={handleChooseFileClick}>
        Upload a file
      </SelectFileButton>
    </span>
    <input
      type="file"
      ref={ref}
      onInput={handleSelectFile}
      style={{ display: 'none' }}
    />
  </div>
));

const Home = () => {
  const dropZoneRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const downloadButtonRef = useRef(null);
  const hiddenFileInputRef = useRef(null);
  const [filterString, setFilterString, filterStringRef] = useStateRef('');
  const [disabledInputs, setDisabledInputs] = useState(true);

  const applyCanvasFilters = () => {
    if (!imageRef.current || !imageRef.current.src) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.filter = filterStringRef.current;
    ctx.drawImage(imageRef.current, 0, 0);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = 0;
    canvas.height = 0;
    canvas.style.width = '0px';
    canvas.style.height = '0px';
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    downloadButtonRef.current.removeAttribute('href');
    imageRef.current.removeAttribute('src');
    setDisabledInputs(true);
  };

  const updateDownloadName = ({ name }) => {
    let newName;
    const splittedName = name.split('.');

    if (splittedName.length === 1) {
      newName = `${splittedName[0]}-edited.png`;
    } else {
      const ext = splittedName.pop();
      const fileNameWithoutExt = splittedName.join('.');
      newName = `${fileNameWithoutExt}-edited.${ext}`;
    }

    downloadButtonRef.current.download = newName;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const { dataTransfer: { items: [file] } } = e;
    const reader = new FileReader();

    reader.onload = () => {
      imageRef.current.src = reader.result;
    };

    const fileData = file.getAsFile();
    reader.readAsDataURL(fileData);
    updateDownloadName(fileData);
  };

  useEffect(() => {
    const resizeCanvas = () => {
      adjustImageSize(dropZoneRef.current, canvasRef.current);
      applyCanvasFilters();
    };

    imageRef.current = new Image();
    imageRef.current.onload = () => {
      initCanvasSize(canvasRef.current, imageRef.current);
      resizeCanvas();
      setDisabledInputs(false);
    };
    const canvasResizer = new ResizeObserver(resizeCanvas);
    canvasResizer.observe(dropZoneRef.current);

    return () => canvasResizer.disconnect();
  }, []);

  useEffect(() => {
    applyCanvasFilters();
  }, [filterString]);

  const handleDownload = () => {
    if (imageRef.current.src || !disabledInputs) {
      downloadButtonRef.current.href = canvasRef.current.toDataURL();
    }
  };

  const handleSelectFile = ({ target }) => {
    const fileUploaded = target.files[0];
    if (!fileUploaded) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      imageRef.current.src = reader.result;
      hiddenFileInputRef.current.value = '';
    };

    updateDownloadName(fileUploaded);
    reader.readAsDataURL(fileUploaded);
  };

  const handleChooseFileClick = () => {
    hiddenFileInputRef.current.click();
  };

  return (
    <Container>
      <Sidebar>
        <Slider
          setFilterString={setFilterString}
          disabledInputs={disabledInputs}
          clearCanvas={clearCanvas}
        />
        <DownloadButton
          disabledInputs
          ref={downloadButtonRef}
          download
          onClick={handleDownload}
        >
          Download Image
        </DownloadButton>
      </Sidebar>
      <ImageContainer
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragEnter={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        <canvas width="0" height="0" ref={canvasRef} />
        {(imageRef.current && !imageRef.current.src)
        && (
        <DropOrSelectFile
          handleChooseFileClick={handleChooseFileClick}
          handleSelectFile={handleSelectFile}
          ref={hiddenFileInputRef}
        />
        )}
      </ImageContainer>
    </Container>
  );
};

export default Home;
