import "./styles.css";
import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import ColorThief from "colorthief";

export default function App() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedColor, setCapturedColor] = useState(null);
  const [capturedPalette, setCapturedPalette] = useState(null);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  useEffect(() => {
    getCameraDevices();
  }, []);

  useEffect(() => {
    if (capturedImage) {
      getColorOfCapturedImage();
    }
  }, [capturedImage]);

  const getCameraDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setCameraDevices(cameras);
      setSelectedCamera(cameras[0]?.deviceId || "");
    } catch (error) {
      console.error("Error getting camera devices:", error);
    }
  };

  // remove the background of the photo before extracting color

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const getColorOfCapturedImage = () => {
    const img = new Image();
    img.src = capturedImage;

    img.onload = () => {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      const palette = colorThief.getPalette(img, 2);
      const hexColor = rgbToHex(color[0], color[1], color[2]);
      setCapturedColor(hexColor);
      setCapturedPalette(palette);
    };
  };

  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div>
        <Webcam
          audio={false}
          videoConstraints={{ deviceId: selectedCamera }}
          width={640}
          height={480}
        />
        <button onClick={capturePhoto}>Capture</button>
        {cameraDevices.length > 1 && (
          <select value={selectedCamera} onChange={handleCameraChange}>
            {cameraDevices.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label}
              </option>
            ))}
          </select>
        )}
        {capturedImage && <img src={capturedImage} alt="Captured" />}
        {capturedColor && (
          <div style={{ backgroundColor: capturedColor }}>
            Captured Color: {capturedColor}
          </div>
        )}
      </div>
    </div>
  );
}
