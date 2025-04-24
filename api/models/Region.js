import mongoose from 'mongoose';

const neighborhoodSchema = new mongoose.Schema({
  id: String,
  valueEnglish: String,
  valueArabic: String
});

const citySchema = new mongoose.Schema({
  id: String,
  cityNameEnglish: String,
  cityNameArabic: String,
  neighborhoods: [neighborhoodSchema]
});

const regionSchema = new mongoose.Schema({
  id: String,
  regionNameEnglish: String,
  regionNameArabic: String,
  cities: [citySchema]
});

const Region = mongoose.model('Region', regionSchema);
export default Region;
