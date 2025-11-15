import Navigation from '../components/Navigation';
import MapComponent from '../components/MapComponent';

function HomePage() {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
            <Navigation />
            <div className="flex-1 ml-80 h-screen relative">
                <MapComponent />
            </div>
        </div>
    );
}

export default HomePage;
