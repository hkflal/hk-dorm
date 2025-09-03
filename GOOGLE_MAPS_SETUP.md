# Google Maps Integration Setup

This guide explains how to set up Google Maps integration for the dorm-hub application.

## 🗺️ Features

The Google Maps integration provides:
- **Interactive Maps**: Real location display for each property
- **Property Markers**: Custom markers showing exact property locations
- **MTR Station Markers**: Nearby MTR stations automatically marked
- **Directions**: Get directions to properties
- **Street View**: Street view integration
- **Geocoding**: Automatic address-to-coordinates conversion

## 📋 Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. In Google Cloud Console, go to **Credentials**
2. Click on your API key
3. Under **Application restrictions**, select **HTTP referrers**
4. Add these referrers:
   ```
   https://hk-dormitory-hub.web.app/*
   https://hk-dormitory-hub.firebaseapp.com/*
   http://localhost:3000/*
   ```
5. Under **API restrictions**, select **Restrict key**
6. Choose these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### 3. Add API Key to Environment

1. Create or update your `.env.local` file:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. **Important**: Never commit your API key to version control!

### 4. Update Firebase Environment (for production)

If deploying to Firebase, add the environment variable:

```bash
firebase functions:config:set google.maps_api_key="your_api_key_here"
```

## 🎯 Usage

The Google Maps component is automatically used in property detail pages:

```tsx
<GoogleMap
  address={property.location.address}
  title={property.title}
  coordinates={property.location.coordinates}
  nearbyMTR={property.location.nearbyMTR}
/>
```

## 🔧 Component Features

### Map Display
- Interactive map centered on property location
- Custom property marker (red pin)
- MTR station markers (blue circles with 'M')
- Street view controls
- Zoom controls

### User Actions
- **Get Directions**: Opens Google Maps with directions
- **View in Google Maps**: Opens location in Google Maps
- **Info Windows**: Click markers for property/station info

### Error Handling
- Graceful fallback if API key is missing
- Geocoding fallback if coordinates unavailable
- Loading states and error messages
- Alternative links to Google Maps

## 📱 Mobile Optimization

The component is fully responsive:
- Touch-friendly controls
- Responsive map sizing
- Mobile-optimized info windows
- Appropriate button sizing

## 🚀 Performance

- Lazy loading of Google Maps API
- Efficient marker management
- Optimized for static site generation
- Minimal bundle impact

## 🔒 Security Best Practices

1. **Restrict API Key**: Always use HTTP referrer restrictions
2. **Monitor Usage**: Set up billing alerts in Google Cloud
3. **Limit APIs**: Only enable required APIs
4. **Environment Variables**: Never expose API keys in client code

## 💰 Pricing

Google Maps pricing (as of 2024):
- **Maps JavaScript API**: $7 per 1,000 loads
- **Places API**: $17 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests

**Free tier**: 28,500 map loads per month

## 🐛 Troubleshooting

### Common Issues

1. **"This page can't load Google Maps correctly"**
   - Check API key is correct
   - Verify APIs are enabled
   - Check billing is set up

2. **Map not loading**
   - Check console for JavaScript errors
   - Verify environment variable name
   - Check network connectivity

3. **Markers not appearing**
   - Verify address format
   - Check coordinates are valid
   - Ensure Places API is enabled

### Debug Mode

Add this to see detailed logging:
```tsx
console.log('Google Maps API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.substring(0, 10) + '...')
```

## 🔄 Fallback Behavior

If Google Maps fails to load:
- Shows fallback UI with address
- Provides links to Google Maps
- Maintains full functionality
- No broken user experience

## 🎨 Customization

The component supports customization:
- Custom marker icons
- Map styling
- Info window content
- Control visibility
- Zoom levels

## 📊 Analytics

Consider tracking:
- Map interactions
- Direction requests
- Popular properties
- User engagement

This integration provides a professional, user-friendly mapping experience for your dorm listings! 🏠📍
