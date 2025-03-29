
import React from 'react';
import { Leaf } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf className="h-5 w-5 text-plantDoc-primary" />
            <span className="font-bold text-plantDoc-dark">Plant Doc</span>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Plant Doc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
