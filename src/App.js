import { useRef, useEffect } from 'react';
import './App.css';
import * as faceapi from "face-api.js";
function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
}, []);
  const loadModels = () => {
     Promise.all([
         faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
         faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
         faceapi.nets.faceExpressionNet.loadFromUri('/models'),
     ]).then(() => {
         faceDetection();
        })
};
  const startVideo = () => {
     navigator.mediaDevices.getUserMedia({ video: true })
     .then((currentStream) => {
          videoRef.current.srcObject = currentStream;
      }).catch((err) => {
         console.error(err)
         });
}
  const faceDetection = async () => {
    setInterval(async() => {
      const detections = await faceapi.detectAllFaces
           (videoRef.current, new faceapi.TinyFaceDetectorOptions())
           .withFaceLandmarks().withFaceExpressions();
canvasRef.current.innerHtml = faceapi.
     createCanvasFromMedia(videoRef.current);
faceapi.matchDimensions(canvasRef.current, {
    width: 940,
    height: 650,
})
const resized = faceapi.resizeResults(detections, {
    width: 940,
    height: 650,
});
// to draw the detection onto the detected face i.e the box
faceapi.draw.drawDetections(canvasRef.current, resized);
//to draw the the points onto the detected face
faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
//to analyze and output the current expression by the detected face
faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
}, 1000)
}
return (
  <div  className="app">
     <h1> AI FACE DETECTION</h1>
     <div className='app__video'>
        <video crossOrigin='anonymous' ref={videoRef} autoPlay  />
        
     </div>
     <canvas ref={canvasRef} width="940" height="650" className='app__canvas' />
 </div>
 
);
}
export default App;