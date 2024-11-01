import './App.css';
import DynamicChart from './DynamicChart';
import starWarsImage from './font/1080p-star-wars-background-image.jpg';

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <div className="top-column">
        <iframe
          className="video-background"
          src="https://www.youtube.com/embed/iRmRGP9hzy8?autoplay=1&mute=1&loop=1&playlist=iRmRGP9hzy8"
          title="Star Wars Video Background"
          allowFullScreen
          frameBorder="0"
        ></iframe>
        <div className="star-wars-headline">STAR WARS</div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <DynamicChart />
      </div>

      <div className="bottom-column">
        <img
          src={starWarsImage}
          alt="Star Wars Background"
          className="full-width-image" // Use a CSS class idanstead of inline styles
        />
      </div>
    </div>
  );
}

export default App;
