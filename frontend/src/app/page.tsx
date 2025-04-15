import Image from "next/image";
import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Background design elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-indigo-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Header */}
      <div className="flex-none p-4 sm:p-6 text-center bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="inline-flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gradient-bg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold gradient-text">Hamza AI Agent</h1>
        </div>
      </div>

      {/* Chat Component */}
      <div className="flex-1 overflow-hidden">
        <Chat />
      </div>
    </main>
  );
}
