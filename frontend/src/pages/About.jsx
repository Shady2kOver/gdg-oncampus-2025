function About() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">About</h1>
      <div className="card space-y-4">
        <p className="text-gray-700">
          The Neuro-Divergent Study Helper is a web application designed to assist
          students with ADHD and other neurodivergent conditions in their studies.
        </p>
        <p className="text-gray-700">
          Features include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Pomodoro Timer - Helps maintain focus with timed study sessions
          </li>
          <li>
            Bionic Reading - Makes text easier to read by highlighting key parts
            of words
          </li>
          <li>
            Document Reader - Supports both PDF and text files with customizable
            reading options
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About; 