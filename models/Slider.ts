import mongoose from 'mongoose';

const sliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  badge: { type: String, default: 'New Arrival' },
  titleStart: { type: String, required: true },
  titleHighlight: { type: String, required: true }, 
  titleEnd: { type: String },
  description: { type: String, required: true },
  // Button 1 (Main)
  buttonText: { type: String, default: 'Shop Now' },
  link: { type: String, default: '/UI-Components/Shop' },
  // Button 2 (Optional)
  secondaryBtnText: { type: String, default: '' },
  secondaryBtnLink: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Slider || mongoose.model('Slider', sliderSchema);