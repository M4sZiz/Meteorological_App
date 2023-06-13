import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Loading from '../components/Loading';

import { WiStrongWind } from 'react-icons/wi';
import { CiDroplet } from 'react-icons/ci';
import Chart from '../components/Chart';

import imagesPath from "../imagePath.json"

import { endpoint } from '../constants';

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [weathers, setWeathers] = useState();
    const [currentWeather, setCurrentWeather] = useState()

    const [cityName, setCityName] = useState('');

    useEffect(() => {
        getWeatherData();
    }, []);

    const getWeatherData = async () => {
        const requset = await fetch(`${endpoint}/v1/weather/details/?cityId=${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            }
        );
        const response = await requset.json();

        if (requset.status === 200) {
            setLoading(false);
            setCityName(response['city'].name);
            setWeathers(response['weather']);

            let current = {};
            for (let i = 0; i < response['city']['weather'].length; i++) {
                let value = response['city']['weather'][i].coordinates[0].dates[0].value;
                if (response['city']['weather'][i].parameter === 't_2m:C') {
                    current['temp'] = value;
                }
                if (response['city']['weather'][i].parameter === 'precip_1h:mm') {
                    current['precip'] = value;
                }
                if (response['city']['weather'][i].parameter === 'wind_speed_10m:ms') {
                    current['windSpeed'] = value;
                }
                if (response['city']['weather'][i].parameter === 'weather_symbol_1h:idx') {
                    current['weatherSymbol'] = value;
                }

            }
            setCurrentWeather(current);
        }
        else {
            alert(response['error']);
            navigate('/');
        }

    };

    if (loading) {
        return <Loading />
    }


    return (
        <div className="container bg-backgrounds-body mx-auto px-5 py-5">

            <button className="bg-primary text-white px-4 py-2 mb-2 rounded shadow" onClick={() => window.history.back()}>Back</button>

            <div className="flex flex-col gap-4">

                <div className="flex bg-backgrounds-card p-4 rounded shadow justify-between items-center">
                        <h2 className="text-lg font-semibold ">{cityName}</h2>
                        <div className="flex items-center ">
                            <span className="text-xl ml-2">{currentWeather?.temp}°C</span>
                        </div>
                        <div className="flex items-center ">
                            <CiDroplet className="text-secondary text-xl" />
                            <span className="ml-2">Precipitation: {currentWeather?.precip} mm</span>
                        </div>
                        <div className="flex items-center">
                            <WiStrongWind className="text-secondary text-xl" />
                            <span className="ml-2">Wind Speed: {currentWeather?.windSpeed} km/h</span>
                        </div>
                    <div className='flex items-center'>
                        <img className="w-20 h-20" src={require(`../images/weather/${imagesPath[currentWeather?.weatherSymbol]}`)} alt="weather" />
                    </div>

                </div>
                <div className="bg-backgrounds-body p-4 rounded shadow h-full  text-text">
                        <h2 className="text-lg font-semibold mb-4">Temperature chart</h2>
                        <div className="flex justify-center">
                            <Chart
                                type={'line'}
                                label={'Temperature (C)'}
                                weathers={weathers}
                                parameter={'t_2m:C'}
                                borderColor={'rgba(75,192,192,0)'}
                                withIcon={true}
                                iconParameter={'weather_symbol_1h:idx'}
                            />
                        </div>
                    </div>
                <div className="flex lg:flex-row flex-col">
                    
                    <div className="bg-backgrounds-body p-4 rounded shadow h-full lg:w-1/2 text-text">
                        <h2 className="text-lg font-semibold mb-4">Precipitation chart</h2>
                        <div className="flex justify-center">
                            <Chart
                                type={'bar'}
                                label={'Precipitation (mm)'}
                                weathers={weathers}
                                parameter={'precip_1h:mm'}
                                borderColor={'rgba(75,192,192,0)'}
                            />
                        </div>
                    </div>
                    <div className="bg-backgrounds-body p-4 rounded shadow h-full lg:w-1/2 text-text">
                        <h2 className="text-lg font-semibold mb-4">Wind speed and Direction </h2>
                        <div className="flex justify-center">
                            <Chart
                                type={'line'}
                                label={'Wind speed (ms)'}
                                weathers={weathers}
                                parameter={'wind_speed_10m:ms'}
                                borderColor={'rgba(75,192,192,0)'}
                                withIcon={true}
                                iconParameter={'wind_dir_10m:d'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
