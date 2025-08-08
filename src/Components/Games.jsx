import React from 'react';

const Games = () => {
    return (
        <div className="w-full h-screen px-4 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Play Educational Games</h1>
            <iframe
                src="https://toytheater.com/math-fact-shoot-out/"
                width="100%"
                height="600px"
                title="Math Game"
                frameBorder="0"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default Games;
