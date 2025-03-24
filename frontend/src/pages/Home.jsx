import Pomodoro from '../components/Pomodoro';
import DocumentReader from '../components/DocumentReader';

function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary text-center font-montserrat">
        Neuro-Divergent Study Helper
      </h1>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Pomodoro />
        <DocumentReader />
      </div>
    </div>
  );
}

export default Home; 