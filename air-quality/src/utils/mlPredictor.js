/**
 * ML Predictor for Air Quality
 * Uses simple moving average + trend analysis for 24-hour predictions
 */

/**
 * Predict AQI for next 24 hours
 * @param {Array} historicalData - Array of hourly objects with {hour, aqi} or {year, month, day, hour, aqi}
 * @param {number} currentHour - Current hour (0-23)
 * @returns {Array} Predicted AQI for next 24 hours
 */
export const predictAQI = (historicalData, currentHour = new Date().getHours()) => {
  if (!historicalData || historicalData.length === 0) {
    // Return dummy predictions if no data
    return generateDummyPredictions(currentHour);
  }

  // Extract AQI values
  const aqiValues = historicalData.map(d => Number(d.aqi) || 0).filter(v => v >= 0);

  if (aqiValues.length === 0) {
    return generateDummyPredictions(currentHour);
  }

  // Calculate statistics
  const mean = aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length;
  const trend = calculateTrend(aqiValues);
  const volatility = calculateVolatility(aqiValues, mean);

  // Generate predictions
  const predictions = [];
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    const hourStr = String(hour).padStart(2, '0') + ':00';

    // Apply hourly pattern (e.g., morning lower, evening higher)
    const hourlyPattern = getHourlyPattern(hour);

    // Calculate predicted value
    let predictedAQI = mean + (trend * i * 0.5) + hourlyPattern;

    // Add slight randomness for realism
    const randomFactor = (Math.random() - 0.5) * (volatility * 0.3);
    predictedAQI = Math.round(predictedAQI + randomFactor);

    // Ensure non-negative
    predictedAQI = Math.max(0, predictedAQI);

    // Calculate confidence (decreases over time)
    const confidence = 1 - (i / 24) * 0.3;

    // Determine precautions
    const precautions = getPrecautions(predictedAQI);

    predictions.push({
      hour: hourStr,
      hourNum: hour,
      predictedAQI,
      confidence: parseFloat(confidence.toFixed(2)),
      precautions,
    });
  }

  return predictions;
};

/**
 * Calculate trend from historical data
 * Positive = increasing, Negative = decreasing
 */
const calculateTrend = (values) => {
  if (values.length < 2) return 0;

  let trend = 0;
  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    trend += diff;
  }

  return trend / (values.length - 1);
};

/**
 * Calculate volatility (standard deviation) of data
 */
const calculateVolatility = (values, mean) => {
  if (values.length < 2) return 0;

  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

/**
 * Get hourly pattern factor
 * Air quality typically improves in early morning, worsens in evening
 */
const getHourlyPattern = (hour) => {
  // Hour-based pattern (typical AQI behavior)
  const patterns = {
    0: -10,  // 00:00 - Better overnight
    1: -12,
    2: -15,  // Best around 3-4 AM
    3: -15,
    4: -10,
    5: -5,   // Starts increasing
    6: 0,
    7: 5,    // Morning traffic begins
    8: 10,
    9: 8,
    10: 5,
    11: 3,
    12: 5,   // Noon - relatively stable
    13: 8,
    14: 10,
    15: 12,  // Afternoon increases
    16: 15,
    17: 18,  // Evening peak
    18: 20,
    19: 18,  // Starts to stabilize
    20: 15,
    21: 12,
    22: 8,
    23: 0,   // Late night - improving
  };

  return patterns[hour] || 0;
};

/**
 * Get precautions based on predicted AQI
 */
const getPrecautions = (aqi) => {
  const precautions = [];

  if (aqi <= 50) {
    precautions.push('Air quality is good. Enjoy outdoor activities!');
  } else if (aqi <= 100) {
    precautions.push('Air quality is satisfactory.');
    precautions.push('Sensitive people should limit prolonged outdoor exertion.');
  } else if (aqi <= 200) {
    precautions.push('Moderate air quality. Wear N95 mask for outdoor activities.');
    precautions.push('Avoid heavy outdoor exertion.');
    precautions.push('Keep windows closed.');
  } else if (aqi <= 300) {
    precautions.push('Poor air quality. Limit outdoor activities.');
    precautions.push('Wear N95/N100 mask if outdoors.');
    precautions.push('Use air purifier indoors.');
    precautions.push('Drink plenty of water.');
  } else {
    precautions.push('SEVERE air quality alert!');
    precautions.push('Stay indoors as much as possible.');
    precautions.push('Wear N95/N100 mask if you must go outside.');
    precautions.push('Use air purifier and humidifier.');
    precautions.push('Consult a doctor if experiencing respiratory issues.');
  }

  return precautions;
};

/**
 * Generate dummy predictions (fallback)
 */
const generateDummyPredictions = (currentHour) => {
  const predictions = [];
  const baseLine = 120; // Base line AQI

  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    const hourStr = String(hour).padStart(2, '0') + ':00';

    // Create realistic pattern with slight variations
    const hourlyPattern = getHourlyPattern(hour);
    let aqi = baseLine + hourlyPattern + Math.random() * 20 - 10;
    aqi = Math.max(0, Math.round(aqi));

    predictions.push({
      hour: hourStr,
      hourNum: hour,
      predictedAQI: aqi,
      confidence: parseFloat((0.8 - (i / 24) * 0.3).toFixed(2)),
      precautions: getPrecautions(aqi),
    });
  }

  return predictions;
};

/**
 * Get health alerts for predicted AQI values
 */
export const getHealthAlert = (predictions) => {
  if (!predictions || predictions.length === 0) return null;

  const maxAQI = Math.max(...predictions.map(p => p.predictedAQI));
  const avgAQI = Math.round(
    predictions.reduce((sum, p) => sum + p.predictedAQI, 0) / predictions.length
  );

  let alertLevel = 'good';
  let alertMessage = 'Good air quality expected';

  if (maxAQI <= 50) {
    alertLevel = 'good';
    alertMessage = '✅ Good air quality throughout the day';
  } else if (maxAQI <= 100) {
    alertLevel = 'satisfactory';
    alertMessage = '⚠️ Satisfactory air quality. Sensitive people should take precautions.';
  } else if (maxAQI <= 200) {
    alertLevel = 'moderate';
    alertMessage = '⚠️ Moderate air quality. Wear N95 mask if going outdoors.';
  } else if (maxAQI <= 300) {
    alertLevel = 'poor';
    alertMessage = '🚨 Poor air quality. Limit outdoor activities.';
  } else {
    alertLevel = 'severe';
    alertMessage = '🔴 SEVERE air quality alert! Stay indoors.';
  }

  return {
    alertLevel,
    alertMessage,
    maxAQI,
    avgAQI,
    peakHour: predictions.find(p => p.predictedAQI === maxAQI)?.hour,
  };
};
