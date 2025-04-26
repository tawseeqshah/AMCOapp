import React, { useEffect, useState } from 'react';
import { IoArrowBack, IoSearch, IoCopy, IoClose, IoEye, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
// Import Excel files as URLs
// Use relative path with import.meta.url for Vite asset handling

interface VehicleInfo {
  cbn: string;
  description: string;
  tyres: string;
  basePrice: string;
  dealerMarkup: string;
  mrp: string;
}

interface DetailField {
  label: string;
  key: keyof VehicleInfo | 'bodyType' | 'cabinType';
  value: string;
  highlight?: boolean;
}

const VehicleSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<VehicleInfo[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleInfo[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'search' | 'all'>('search');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleInfo | null>(null);
  const [showQuickPick, setShowQuickPick] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof VehicleInfo>('cbn');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const RESULTS_PER_PAGE = 10;
  
  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const loadExcelData = async () => {
      try {
        setIsLoading(true);
        
        // The correct path to the new Excel file (note the apostrophe in the name)
        const excelFileUrl = new URL('../assets/MRP circular Effective 1st Jan\'25_Combined new.xlsx', import.meta.url).href;
        console.log('Loading Excel file from:', excelFileUrl);
        
        const response = await fetch(excelFileUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Excel file: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const allVehicleData: VehicleInfo[] = [];
        
        // Process all sheets in the workbook
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          console.log(`Processing sheet: ${sheetName}, rows: ${jsonData.length}`);
          
          // Log column headers from the first row to help debug
          if (jsonData.length > 0) {
            const firstRow = jsonData[0] as Record<string, unknown>;
            console.log('Column headers found:', Object.keys(firstRow));
          }
          
          jsonData.forEach((row: any, index: number) => {
            // Check if row has CBN data
            if (row['CBN NO'] || row['CBN'] || row['CBN No'] || row['CBN No.']) {
              const cbn = (row['CBN NO'] || row['CBN'] || row['CBN No'] || row['CBN No.'] || '').toString();
              const description = row['Description'] || row['DESCRIPTION'] || row['Vehicle Description'] || '';
              const tyres = row['TYRES'] || row['Tyres'] || '';
              const basePrice = row['Base Price (AL to Dealer)'] || row['Base Price'] || '';
              const dealerMarkup = row['Dealer markup'] || row['Dealer Markup'] || '';
              
              // Expanded list of possible MRP column names with flexible spacing and capitalization
              const mrpColumnNames = [
                'Maximum Retail Price incl  of GST@28%',
                'Maximum Retail Price incl of GST@28%',
                'Maximum Retail Price incl. of GST@28%',
                'MRP',
                'Maximum Retail Price',
                'Max. Retail Price',
                'Retail Price',
                'Price', 
                'GST Price'
              ];
              
              // Find the first matching MRP column
              let mrp = '';
              for (const colName of mrpColumnNames) {
                if (row[colName] !== undefined && row[colName] !== null) {
                  mrp = row[colName].toString();
                  break;
                }
              }
              
              // If still no MRP found, search case-insensitively
              if (!mrp) {
                const rowKeys = Object.keys(row);
                const mrpKey = rowKeys.find(key => 
                  key.toLowerCase().includes('mrp') || 
                  key.toLowerCase().includes('retail price') || 
                  key.toLowerCase().includes('gst')
                );
                
                if (mrpKey) {
                  mrp = row[mrpKey].toString();
                }
              }
              
              // Debug log for rows with missing MRP
              if (!mrp && index < 5) {
                console.log(`No MRP found for CBN ${cbn}, row keys:`, Object.keys(row));
                console.log('Row data:', row);
              }

              if (cbn) {
                allVehicleData.push({
                  cbn,
                  description: description?.toString() || '',
                  tyres: tyres?.toString() || '',
                  basePrice: basePrice?.toString() || '',
                  dealerMarkup: dealerMarkup?.toString() || '',
                  mrp: mrp || ''
                });
              }
            }
          });
        });
        
        console.log('Loaded vehicle data:', allVehicleData.length, 'items');
        console.log('Sample MRP values:', allVehicleData.slice(0, 5).map(v => v.mrp));
        setVehicleData(allVehicleData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Excel data:', err);
        setError(`Failed to load vehicle data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };
    
    loadExcelData();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError('Please enter a CBN number or vehicle name');
      setSearchResults([]);
      return;
    }
    
    setError('');
    const searchTermLower = searchTerm.toLowerCase();
    
    // Filter vehicles that match the search term
    const results = vehicleData.filter(
      vehicle => 
        vehicle.cbn.toLowerCase().includes(searchTermLower) || 
        vehicle.description.toLowerCase().includes(searchTermLower)
    );
    
    console.log('Search results:', results.length, 'items');
    
    if (results.length > 0) {
      setSearchResults(results);
      setSelectedVehicle(null);
      setCurrentPage(1);
      setShowQuickPick(false);
    } else {
      setError('No vehicle found with the given CBN number or name');
      setSearchResults([]);
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      const searchTermLower = value.toLowerCase();
      const quickResults = vehicleData
        .filter(vehicle => 
          vehicle.cbn.toLowerCase().includes(searchTermLower) || 
          vehicle.description.toLowerCase().includes(searchTermLower)
        )
        .slice(0, 5);
      
      if (quickResults.length > 0) {
        setSearchResults(quickResults);
        setShowQuickPick(true);
      } else {
        setShowQuickPick(false);
      }
    } else {
      setShowQuickPick(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowQuickPick(false);
  };

  const getBodyType = (description: string) => {
    if (!description) return 'N/A';
    
    if (description.toLowerCase().includes('deck')) return 'Deck Body';
    if (description.toLowerCase().includes('chassis')) return 'Chassis';
    if (description.toLowerCase().includes('cabin')) return 'Cabin';
    
    return 'Standard';
  };

  const getCabinType = (description: string) => {
    if (!description) return 'N/A';
    
    if (description.toLowerCase().includes('day cabin')) return 'Day Cabin';
    if (description.toLowerCase().includes('sleeper')) return 'Sleeper Cabin';
    if (description.toLowerCase().includes('cabin')) return 'Standard Cabin';
    
    return 'N/A';
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const handleSort = (field: keyof VehicleInfo) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedResults = () => {
    return [...searchResults].sort((a, b) => {
      let valueA = a[sortField]?.toLowerCase() || '';
      let valueB = b[sortField]?.toLowerCase() || '';
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  };

  const getPaginatedResults = () => {
    const sorted = getSortedResults();
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    return sorted.slice(startIndex, startIndex + RESULTS_PER_PAGE);
  };

  const totalPages = Math.ceil(searchResults.length / RESULTS_PER_PAGE);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVehicleClick = (vehicle: VehicleInfo) => {
    setSelectedVehicle(vehicle);
    setShowQuickPick(false);
  };

  const closeVehicleDetail = () => {
    setSelectedVehicle(null);
  };

  const renderQuickPickDropdown = () => {
    if (!showQuickPick || searchResults.length === 0) return null;
    
    return (
      <div className="quick-pick-dropdown">
        <div className="quick-pick-header">
          <span>Quick Results</span>
        </div>
        <div className="quick-pick-list">
          {searchResults.map((vehicle, index) => (
            <div 
              key={index} 
              className="quick-pick-item"
              onClick={() => handleVehicleClick(vehicle)}
            >
              <div 
                className="quick-item-model" 
                dangerouslySetInnerHTML={{__html: highlightText(vehicle.cbn, searchTerm)}}
              ></div>
              <div className="quick-item-desc">{vehicle.description}</div>
            </div>
          ))}
        </div>
        <div className="quick-pick-footer">
          <button 
            className="see-all-btn"
            onClick={handleSearch}
          >
            See all results
          </button>
        </div>
      </div>
    );
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) return null;
    
    const paginatedResults = getPaginatedResults();
    
    return (
      <div className="search-results-container">
        <div className="results-header">
          <div className="results-count">
            Found {searchResults.length} matching vehicle(s)
          </div>
        </div>
        
        {isMobile ? (
          // Mobile card layout
          <div className="mobile-results">
            {paginatedResults.map((vehicle, index) => (
              <div className="mobile-card" key={index} onClick={() => handleVehicleClick(vehicle)}>
                <div className="mobile-card-header">
                  <div 
                    className="mobile-card-model" 
                    dangerouslySetInnerHTML={{__html: highlightText(vehicle.cbn, searchTerm)}}
                  ></div>
                </div>
                <div className="mobile-card-body">
                  <div 
                    className="mobile-card-desc" 
                    dangerouslySetInnerHTML={{__html: highlightText(vehicle.description, searchTerm)}}
                  ></div>
                  <div className="mobile-card-details">
                    <div className="mobile-card-cabin">{getCabinType(vehicle.description)}</div>
                    <div className="mobile-card-body-type">{getBodyType(vehicle.description)}</div>
                    <div className="mobile-card-mrp">MRP: {vehicle.mrp || 'N/A'}</div>
                  </div>
                  <div className="mobile-card-action">Tap for details</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop table layout
          <div className="results-table">
            <div className="table-header">
              <div 
                className={`header-cell model-cell ${sortField === 'cbn' ? 'sorted' : ''}`}
                onClick={() => handleSort('cbn')}
              >
                Model
                {sortField === 'cbn' && (
                  sortDirection === 'asc' ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />
                )}
              </div>
              <div 
                className={`header-cell desc-cell ${sortField === 'description' ? 'sorted' : ''}`}
                onClick={() => handleSort('description')}
              >
                Description
                {sortField === 'description' && (
                  sortDirection === 'asc' ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />
                )}
              </div>
              <div className="header-cell price-cell">MRP</div>
              <div className="header-cell actions-cell">Actions</div>
            </div>
            
            {paginatedResults.map((vehicle, index) => (
              <div className="table-row" key={index}>
                <div 
                  className="row-cell model-cell clickable"
                  dangerouslySetInnerHTML={{__html: highlightText(vehicle.cbn, searchTerm)}}
                  onClick={() => copyToClipboard(vehicle.cbn, 'cbn')}
                  title="Click to copy CBN"
                ></div>
                <div className="row-cell desc-cell">
                  <div 
                    className="desc-primary clickable" 
                    dangerouslySetInnerHTML={{__html: highlightText(vehicle.description, searchTerm)}}
                    onClick={() => copyToClipboard(vehicle.description, 'description')}
                    title="Click to copy description"
                  ></div>
                  <div className="desc-secondary">
                    {getCabinType(vehicle.description)} · {getBodyType(vehicle.description)}
                  </div>
                </div>
                <div 
                  className="row-cell price-cell clickable"
                  onClick={() => copyToClipboard(vehicle.mrp || 'N/A', 'mrp')}
                  title="Click to copy MRP"
                >
                  {vehicle.mrp || 'N/A'}
                </div>
                <div className="row-cell actions-cell">
                  <button 
                    className="action-btn details-btn"
                    onClick={() => handleVehicleClick(vehicle)}
                    title="View details"
                  >
                    <IoEye size={18} />
                  </button>
                  <button 
                    className="action-btn copy-btn"
                    onClick={() => {
                      const vehicleInfo = `CBN: ${vehicle.cbn}\nDescription: ${vehicle.description}\nTyres: ${vehicle.tyres || 'N/A'}\nBase Price: ${vehicle.basePrice || 'N/A'}\nDealer Markup: ${vehicle.dealerMarkup || 'N/A'}\nMRP: ${vehicle.mrp || 'N/A'}`;
                      copyToClipboard(vehicleInfo, 'all');
                    }}
                    title="Copy all details"
                  >
                    <IoCopy size={18} />
                  </button>
                  {copiedField === 'all' && <span className="copy-tooltip">Copied!</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(current => Math.max(current - 1, 1))}
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(current => Math.min(current + 1, totalPages))}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderVehicleDetail = (vehicle: VehicleInfo) => {
    const detailFields: DetailField[] = [
      { label: 'CBN Number', key: 'cbn', value: vehicle.cbn },
      { label: 'Description', key: 'description', value: vehicle.description || 'N/A' },
      { label: 'Body Type', key: 'bodyType', value: getBodyType(vehicle.description) },
      { label: 'Cabin Type', key: 'cabinType', value: getCabinType(vehicle.description) },
      { label: 'Tyres', key: 'tyres', value: vehicle.tyres || 'N/A' },
      { label: 'Base Price', key: 'basePrice', value: vehicle.basePrice || 'N/A' },
      { label: 'Dealer Markup', key: 'dealerMarkup', value: vehicle.dealerMarkup || 'N/A' },
      { label: 'MRP (incl. GST@28%)', key: 'mrp', value: vehicle.mrp || 'N/A', highlight: true },
    ];

    return (
      <div className="vehicle-detail-modal">
        <div className="vehicle-detail-content">
          <div className="detail-modal-header">
            <h2>{vehicle.description || 'Vehicle ' + vehicle.cbn}</h2>
            <button 
              onClick={closeVehicleDetail}
              className="close-button"
              aria-label="Close details"
              title="Close details"
            >
              <IoClose size={24} />
            </button>
          </div>
          <div className="detail-modal-body">
            {detailFields.map((field, index) => (
              <div className="detail-row" key={index}>
                <span className="detail-label">{field.label}:</span>
                <span 
                  className={`detail-value ${field.highlight ? 'highlight' : ''} clickable`}
                  onClick={() => copyToClipboard(field.value, field.key)}
                  title={`Click to copy ${field.label}`}
                >
                  {field.value}
                  {copiedField === field.key && <span className="copy-indicator">✓ Copied</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
          aria-label="Back to home"
          title="Back to home"
        >
          <IoArrowBack size={24} />
        </button>
        <h1 className="form-title">Vehicle Information</h1>
      </div>
      
      <div className="vehicle-search-container">
        <div className="vehicle-tabs">
          <button 
            className={`tab-button ${viewMode === 'search' ? 'active' : ''}`}
            onClick={() => setViewMode('search')}
          >
            Search Vehicle
          </button>
          <button 
            className={`tab-button ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('all');
              setSearchResults(vehicleData);
              setCurrentPage(1);
            }}
          >
            All Vehicles ({vehicleData.length})
          </button>
        </div>
        
        {viewMode === 'search' ? (
          <>
            <div className="search-box">
              <div className="search-input-container">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInput}
                  placeholder="Enter CBN number or vehicle name..."
                  className="search-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchTerm && (
                  <button 
                    className="clear-search-btn"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <IoClose size={20} />
                  </button>
                )}
                <button 
                  onClick={handleSearch}
                  className="search-button"
                  disabled={isLoading || !searchTerm.trim()}
                  aria-label="Search vehicles"
                  title="Search vehicles"
                >
                  <IoSearch size={20} />
                </button>
              </div>
              {renderQuickPickDropdown()}
              {error && <p className="search-error">{error}</p>}
            </div>
            
            {isLoading ? (
              <div className="loading-indicator">
                <p>Loading vehicle data...</p>
              </div>
            ) : !showQuickPick && searchResults.length > 0 ? (
              renderSearchResults()
            ) : null}
          </>
        ) : (
          <div className="all-vehicles-container">
            {isLoading ? (
              <div className="loading-indicator">
                <p>Loading vehicle data...</p>
              </div>
            ) : vehicleData.length > 0 ? (
              renderSearchResults()
            ) : (
              <p className="no-vehicles">No vehicle data available</p>
            )}
          </div>
        )}
        
        {selectedVehicle && renderVehicleDetail(selectedVehicle)}
      </div>
    </div>
  );
};

export default VehicleSearchPage; 