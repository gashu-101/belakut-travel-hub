
import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

const SuccessAnimation = ({ show, message }: { show: boolean; message: string }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 shadow-2xl animate-scale-in max-w-sm mx-4">
        <div className="text-center">
          <div className="relative mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -bottom-1 -left-1 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Success! 🎉</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
