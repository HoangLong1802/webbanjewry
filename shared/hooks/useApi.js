import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../../shared/services/ApiService';

// Custom hook for API calls
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    body = null,
    headers = {},
    immediate = true,
    onSuccess = null,
    onError = null
  } = options;

  const apiService = new ApiService();

  const execute = useCallback(async (overrideOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const finalOptions = {
        method,
        body,
        headers,
        ...overrideOptions
      };

      let result;
      switch (finalOptions.method.toLowerCase()) {
        case 'post':
          result = await apiService.post(url, finalOptions.body, { headers: finalOptions.headers });
          break;
        case 'put':
          result = await apiService.put(url, finalOptions.body, { headers: finalOptions.headers });
          break;
        case 'delete':
          result = await apiService.delete(url, { headers: finalOptions.headers });
          break;
        default:
          result = await apiService.get(url, { headers: finalOptions.headers });
      }

      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute
  };
};

// Custom hook for form submission
export const useApiForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const apiService = new ApiService();

  const submitForm = useCallback(async (url, formData, options = {}) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const {
        method = 'POST',
        onSuccess = null,
        onError = null,
        successMessage = 'Operation completed successfully'
      } = options;

      let result;
      switch (method.toLowerCase()) {
        case 'put':
          result = await apiService.put(url, formData);
          break;
        case 'patch':
          result = await apiService.patch(url, formData);
          break;
        default:
          result = await apiService.post(url, formData);
      }

      setSubmitSuccess(true);
      
      if (onSuccess) {
        onSuccess(result, successMessage);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Submission failed';
      setSubmitError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  return {
    submitting,
    submitError,
    submitSuccess,
    submitForm,
    resetForm
  };
};

// Custom hook for pagination
export const usePagination = (apiEndpoint, options = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.defaultPageSize || 10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const {
    data: paginatedData,
    loading,
    error,
    execute
  } = useApi(
    `${apiEndpoint}?page=${currentPage}&limit=${pageSize}`,
    {
      immediate: options.immediate !== false,
      onSuccess: (result) => {
        if (result.totalPages !== undefined) setTotalPages(result.totalPages);
        if (result.totalItems !== undefined) setTotalItems(result.totalItems);
        if (result.currentPage !== undefined) setCurrentPage(result.currentPage);
      }
    }
  );

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  return {
    data: paginatedData?.items || paginatedData || [],
    loading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    goToNextPage,
    goToPrevPage,
    changePageSize,
    refetch: execute
  };
};

// Custom hook for search functionality
export const useSearch = (apiEndpoint, options = {}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const {
    debounceMs = 300,
    minQueryLength = 2,
    onSearch = null
  } = options;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const {
    data,
    loading: searchLoading,
    error: searchError,
    execute: executeSearch
  } = useApi(
    debouncedQuery.length >= minQueryLength 
      ? `${apiEndpoint}?keyword=${encodeURIComponent(debouncedQuery)}`
      : null,
    {
      immediate: false,
      onSuccess: (result) => {
        setSearchResults(Array.isArray(result) ? result : result.items || []);
        if (onSearch) onSearch(result, debouncedQuery);
      }
    }
  );

  useEffect(() => {
    if (debouncedQuery.length >= minQueryLength) {
      executeSearch();
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, executeSearch, minQueryLength]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setSearchResults([]);
  }, []);

  return {
    query,
    setQuery,
    searchResults,
    searchLoading,
    searchError,
    clearSearch,
    hasResults: searchResults.length > 0,
    isSearching: debouncedQuery.length >= minQueryLength
  };
};

// Custom hook for real-time updates
export const useRealTimeUpdates = (endpoint, options = {}) => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);

  const {
    interval = 30000, // 30 seconds
    enabled = true
  } = options;

  const {
    data,
    loading,
    error,
    execute
  } = useApi(endpoint, {
    immediate: enabled,
    onSuccess: () => {
      setLastUpdated(new Date());
      setUpdateCount(prev => prev + 1);
    }
  });

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      execute();
    }, interval);

    return () => clearInterval(intervalId);
  }, [execute, interval, enabled]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    updateCount,
    forceUpdate: execute
  };
};

export default {
  useApi,
  useApiForm,
  usePagination,
  useSearch,
  useRealTimeUpdates
};
