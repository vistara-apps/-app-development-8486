import React from 'react';

const SkeletonLoader = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  variant = 'rectangular'
}) => {
  const variants = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  const baseClasses = 'skeleton bg-gray-200 animate-pulse';
  const variantClasses = variants[variant] || variants.rectangular;

  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{ width, height }}
      aria-label="Loading..."
    />
  );
};

// Predefined skeleton components for common use cases
const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader 
        key={index}
        height="1rem"
        width={index === lines - 1 ? '75%' : '100%'}
        variant="text"
      />
    ))}
  </div>
);

const SkeletonCard = ({ className = '' }) => (
  <div className={`p-6 border border-gray-200 rounded-xl ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonLoader width="3rem" height="3rem" variant="circular" />
      <div className="flex-1">
        <SkeletonLoader width="60%" height="1.25rem" className="mb-2" />
        <SkeletonLoader width="40%" height="1rem" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonLoader key={index} height="1.5rem" width="80%" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader key={colIndex} height="1.25rem" width="90%" />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <SkeletonLoader 
      className={`${sizes[size]} ${className}`}
      variant="circular"
    />
  );
};

// Export all components
SkeletonLoader.Text = SkeletonText;
SkeletonLoader.Card = SkeletonCard;
SkeletonLoader.Table = SkeletonTable;
SkeletonLoader.Avatar = SkeletonAvatar;

export default SkeletonLoader;

