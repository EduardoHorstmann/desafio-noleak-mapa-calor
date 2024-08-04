
interface Hit {
  _source: {
    'deepstream-msg' ?: string[];
  };
}

interface Data {
  hits: {
    hits: Hit[];
  };
}

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Heatmap from './components/Heatmap';
import styles from './styles/page.module.css';

const Home: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [imageUrl, setImageUrl] = useState('/image.png');
  const [object, setObject] = useState('person');

  const fetchData = async () => {
    try {
      const response = await axios.get<Data>('/response.json');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching the JSON data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {data && (
        <Heatmap data={data} imageUrl={imageUrl} object={object} />
      )}
    </div>
  );
};

export default Home;