/* ==================== File Path: src/components/WeatherDashboard.jsx ==================== */
import React, { useState, useEffect, useRef } from 'react';
import { fetchWeather } from '../services/weatherService';
import { Chart, registerables } from 'chart.js';

// Register essential Chart.js controllers and elements
Chart.register(...registerables);

function WeatherDashboard() {
    const [city, setCity] = useState('Hyderabad');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // References to keep track of the Canvas element and Chart instance
    const canvasRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Fetch weather automatically on initial component render
    useEffect(() => {
        handleSearch();
    }, []);

    // Sync effect to update and draw the Chart.js graph whenever weatherData changes
    useEffect(() => {
        if (!weatherData || !canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const baseTemp = weatherData.main.temp;

        // Simulate hourly temperature projections centered around current temp
        const labels = ['06:00 AM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'];
        const temperatures = [
            baseTemp - 3, // cooler morning
            baseTemp - 1,
            baseTemp,     // current peak values
            baseTemp + 2, // afternoon peak
            baseTemp - 2,
            baseTemp - 4  // night cooling
        ];

        // Destroy existing chart instance to prevent canvas rendering conflicts
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Initialize new Chart instance
        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Temperature Trend for ${weatherData.name} (°C)`,
                    data: temperatures,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.3 // Smooth bezier curve transitions
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            }
        });

        // Cleanup: destroy chart on component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [weatherData]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await fetchWeather(city);
            setWeatherData(data);
        } catch (err) {
            setError('City not found or network error. Please try again.');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm p-4 bg-white mx-auto" style={{ maxWidth: '700px' }}>
            <h3 className="text-center text-primary mb-4 fw-bold">Live Weather Visualization</h3>

            {/* Input Form */}
            <form onSubmit={handleSearch} className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter city name (e.g., London, Tokyo)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Fetching...' : 'Get Weather'}
                </button>
            </form>

            {/* Error Alert Box */}
            {error && <div className="alert alert-danger text-center">{error}</div>}

            {/* Weather Metrics display */}
            {weatherData && (
                <div className="text-center my-3">
                    <h4 className="fw-bold mb-1">{weatherData.name}, {weatherData.sys.country}</h4>
                    <p className="fs-1 text-danger fw-bold mb-0">{Math.round(weatherData.main.temp)} &deg;C</p>
                    <p className="text-muted text-capitalize mb-3">{weatherData.weather[0].description}</p>

                    <div className="row text-center mb-4 text-secondary" style={{ fontSize: '0.9rem' }}>
                        <div className="col">Humidity: <strong>{weatherData.main.humidity}%</strong></div>
                        <div className="col">Wind: <strong>{weatherData.wind.speed} m/s</strong></div>
                        <div className="col">Min/Max: <strong>{Math.round(weatherData.main.temp_min)}&deg;/{Math.round(weatherData.main.temp_max)}&deg;</strong></div>
                    </div>
                </div>
            )}

            {/* Canvas Element for Chart.js Graph */}
            <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
}

export default WeatherDashboard;