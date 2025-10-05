#!/bin/bash
# Dependency Update Script for English Master Pro
# This script updates all dependencies to latest versions and removes redundant libraries

echo "🚀 Updating English Master Pro Dependencies..."

# Remove redundant chart libraries (keep only recharts)
echo "📦 Removing redundant chart libraries..."
yarn remove chart.js react-chartjs-2 plotly.js react-plotly.js @types/plotly.js @types/react-plotly.js

# Remove Jotai (keeping Zustand for state management)
echo "🗑️  Removing Jotai (consolidating to Zustand)..."
yarn remove jotai

# Update core dependencies to latest
echo "⬆️  Updating Next.js to latest..."
yarn add next@latest

echo "⬆️  Updating React to latest..."
yarn add react@latest react-dom@latest

# Update all Radix UI components
echo "🎨 Updating Radix UI components..."
yarn add @radix-ui/react-accordion@latest @radix-ui/react-alert-dialog@latest \
  @radix-ui/react-aspect-ratio@latest @radix-ui/react-avatar@latest \
  @radix-ui/react-checkbox@latest @radix-ui/react-collapsible@latest \
  @radix-ui/react-context-menu@latest @radix-ui/react-dialog@latest \
  @radix-ui/react-dropdown-menu@latest @radix-ui/react-hover-card@latest \
  @radix-ui/react-label@latest @radix-ui/react-menubar@latest \
  @radix-ui/react-navigation-menu@latest @radix-ui/react-popover@latest \
  @radix-ui/react-progress@latest @radix-ui/react-radio-group@latest \
  @radix-ui/react-scroll-area@latest @radix-ui/react-select@latest \
  @radix-ui/react-separator@latest @radix-ui/react-slider@latest \
  @radix-ui/react-slot@latest @radix-ui/react-switch@latest \
  @radix-ui/react-tabs@latest @radix-ui/react-toast@latest \
  @radix-ui/react-toggle@latest @radix-ui/react-toggle-group@latest \
  @radix-ui/react-tooltip@latest

# Update other important dependencies
echo "📚 Updating other dependencies..."
yarn add framer-motion@latest zustand@latest @tanstack/react-query@latest \
  date-fns@latest lucide-react@latest recharts@latest

# Update dev dependencies
echo "🛠️  Updating dev dependencies..."
yarn add -D typescript@latest @types/node@latest @types/react@latest \
  @types/react-dom@latest tailwindcss@latest postcss@latest \
  autoprefixer@latest eslint@latest

echo "✅ All dependencies updated successfully!"
echo "🧹 Run 'yarn install' to ensure everything is properly installed"
