import Region from '../models/Region.js';

export const createRegion = async (req, res) => {
    try {
      const { regionNameEnglish, regionNameArabic } = req.body;
  
      // Check if region with same English OR Arabic name already exists
      const existingRegion = await Region.findOne({
        $or: [
          { regionNameEnglish },
          { regionNameArabic }
        ]
      });
  
      if (existingRegion) {
        return res.status(409).json({ message: "Region already exists" });
      }
  
      const newRegion = new Region(req.body);
      await newRegion.save();
  
      res.status(200).json(newRegion);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  

export const updateRegion = async (req, res) => {
  try {
    const updated = await Region.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: 'Region not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteRegion = async (req, res) => {
    try {
      const deleted = await Region.findOneAndDelete({ id: req.params.id });
      if (!deleted) return res.status(404).json({ error: 'Region not found' });
      res.status(200).json({ message: 'Region deleted successfully', deleted });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  


export const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.status(200).json(regions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
