'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';

export default function Home() {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Escape Quiz Event
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Scan the QR code to join the quiz!
        </p>
        
        <div className="bg-white p-6 rounded-xl shadow-lg inline-block">
          <QRCode
            value={`${baseUrl}/join`}
            size={256}
            className="mx-auto"
          />
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Join URL: {baseUrl}/join
        </p>
      </motion.div>
    </div>
  );
}
