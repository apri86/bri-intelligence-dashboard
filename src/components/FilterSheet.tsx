import { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, Building2, Package, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFilters } from '../contexts/FilterContext';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  showTerritoryFilter?: boolean;
  showDateRangeFilter?: boolean;
  showBranchFilter?: boolean;
  showProductFilter?: boolean;
}

/**
 * FilterSheet Component
 * Side sheet that slides in from the right for filter controls
 * 
 * Features:
 * - Slides in from right side
 * - Backdrop overlay
 * - Territory, date range, branch, and product filters
 * - Connected to FilterContext
 * - Responsive design
 * - Portal rendering for proper z-index
 */
const FilterSheet: FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  showTerritoryFilter = true,
  showDateRangeFilter = true,
  showBranchFilter = true,
  showProductFilter = true
}) => {
  const { filters, updateFilters, resetFilters } = useFilters();

  // Mock data - in production, these would come from API
  const territories = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur'];
  const branches = ['Jakarta Pusat', 'Jakarta Selatan', 'Bandung', 'Surabaya'];
  const products = ['CASA', 'Credit', 'QRIS', 'Savings'];

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTerritoryChange = (territory: string) => {
    const newTerritories = filters.territory.includes(territory)
      ? filters.territory.filter(t => t !== territory)
      : [...filters.territory, territory];
    
    updateFilters({ territory: newTerritories });
  };

  const handleBranchChange = (branch: string) => {
    const newBranches = filters.branch.includes(branch)
      ? filters.branch.filter(b => b !== branch)
      : [...filters.branch, branch];
    
    updateFilters({ branch: newBranches });
  };

  const handleProductChange = (product: string) => {
    const newProducts = filters.product.includes(product)
      ? filters.product.filter(p => p !== product)
      : [...filters.product, product];
    
    updateFilters({ product: newProducts });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [type === 'start' ? 'startDate' : 'endDate']: newDate
      }
    });
  };

  const activeFilterCount = 
    filters.territory.length + 
    filters.branch.length + 
    filters.product.length;

  const handleReset = () => {
    resetFilters();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Filter className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                  {activeFilterCount > 0 && (
                    <p className="text-sm text-slate-500">
                      {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Range Filter */}
              {showDateRangeFilter && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-600 mb-1.5 block">Start Date</label>
                      <input
                        type="date"
                        value={filters.dateRange.startDate.toISOString().split('T')[0]}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 mb-1.5 block">End Date</label>
                      <input
                        type="date"
                        value={filters.dateRange.endDate.toISOString().split('T')[0]}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Territory Filter */}
              {showTerritoryFilter && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                    <MapPin className="w-4 h-4" />
                    Territory
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {territories.map((territory) => (
                      <button
                        key={territory}
                        onClick={() => handleTerritoryChange(territory)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.territory.includes(territory)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {territory}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Branch Filter */}
              {showBranchFilter && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                    <Building2 className="w-4 h-4" />
                    Branch
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((branch) => (
                      <button
                        key={branch}
                        onClick={() => handleBranchChange(branch)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.branch.includes(branch)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Filter */}
              {showProductFilter && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                    <Package className="w-4 h-4" />
                    Product
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {products.map((product) => (
                      <button
                        key={product}
                        onClick={() => handleProductChange(product)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.product.includes(product)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {product}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FilterSheet;
