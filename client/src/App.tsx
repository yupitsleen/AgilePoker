import { useEffect } from 'react';
import { useRoomStore } from './stores/roomStore';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { PlanningPoker } from './pages/PlanningPoker';
import { ProjectTriangle } from './pages/ProjectTriangle';

function App() {
  const { room, currentPage } = useRoomStore();

  // Check URL for room code on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get('room');

    if (roomCode) {
      // Room code is in URL, but we'll let user click join
      // This could be enhanced to auto-join
    }
  }, []);

  // If no room, show home page
  if (!room) {
    return <Home />;
  }

  // Otherwise show the app with layout
  return (
    <Layout>
      {currentPage === 'poker' ? <PlanningPoker /> : <ProjectTriangle />}
    </Layout>
  );
}

export default App;
