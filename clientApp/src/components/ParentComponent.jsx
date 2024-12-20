const ParentComponent = () => {
  const handleFilterSubmit = (activeFilters) => {
    console.log('Active filters:', activeFilters);
    // Handle the filters here (e.g., make API call, update listings, etc.)
  };

  return (
    <FilterModule 
      onClose={() => setShowFilters(false)}
      onSubmit={handleFilterSubmit}
    />
  );
}; 