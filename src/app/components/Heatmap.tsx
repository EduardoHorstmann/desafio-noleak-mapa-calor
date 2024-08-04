import React, { useEffect, useRef, useState } from 'react';
import Map, { HeatmapConfiguration, HeatmapDataPoint } from 'heatmap.js';
import axios from 'axios';
import styles from '../styles/Heatmap.module.css';

interface HeatmapProps {
  data: {
    hits: {
      hits: {
        fields?: {
          'deepstream-msg'?: string[];
        };
      }[];
    };
  };
  imageUrl: string;
  object: string;
}

const Heatmap: React.FC<HeatmapProps> = ({ data, imageUrl, object }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapContainerRef = useRef<HTMLDivElement>(null);
  const heatmapInstance = useRef<ReturnType<typeof Map.create> | null>(null);
  const [pointsGenerated, setPointsGenerated] = useState<HeatmapDataPoint[]>([]);
  const [heatmapGenerated, setHeatmapGenerated] = useState(false);
  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    checkIfImageExists();
    initializeHeatmap();
  }, [imageUrl]);

  /**
   * Verifica se contém a imagem no disco
   */
  const checkIfImageExists = async () => {
    try {
      const response = await axios.get('/image.png');
      if (response.status === 200) {
        setImageExists(true);
      }
    } catch (error) {
      setImageExists(false);
    }
  };

  /**
   * Inicializa o heatmap
   */
  const initializeHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      contexto.drawImage(img, 0, 0);

      const heatmapConfig: HeatmapConfiguration<HeatmapDataPoint> = {
        container: heatmapContainerRef.current!,
        radius: 20,
        maxOpacity: 0.8,
        minOpacity: 0.2,
        blur: 0.75,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        }
      };

      heatmapInstance.current = Map.create(heatmapConfig);
    };
  };

  /**
   * Gera o heatmap com base nos dados
   */
  const generateHeatmap = async () => {
    if (!heatmapInstance.current) return;

    const points = parseHeatmapData(data, object);
    setPointsGenerated(points);

    const dataForHeatmap = { max: 5, data: points };
    heatmapInstance.current.setData(dataForHeatmap);
    setHeatmapGenerated(true);

    await saveHeatmapImage();
  };

  const parseHeatmapData = (data: HeatmapProps['data'], object: string): HeatmapDataPoint[] => {
    const points: HeatmapDataPoint[] = [];

    data.hits.hits.forEach((hit) => {
      if (hit.fields && hit.fields['deepstream-msg']) {
        const deepstreamMsgs = hit.fields['deepstream-msg'];
        deepstreamMsgs.forEach((msg) => {
          const details = msg.split('|');
          if (details.length >= 6 && details[5] === object) {
            const xMin = parseFloat(details[1]);
            const xMax = parseFloat(details[3]);
            const yMin = parseFloat(details[2]);
            const yMax = parseFloat(details[4]);
            const x = (xMin + xMax) / 2;
            const y = (yMin + yMax) / 2;

            points.push({ x, y, value: 1 });
          }
        });
      }
    });

    return points;
  };

  /**
   * Salva a imagem com os pontos de calor
   */
  const saveHeatmapImage = async () => {
    const canvas = canvasRef.current!;
    const heatmapDataURL = heatmapInstance.current!.getDataURL();

    const heatmapImg = new Image();
    heatmapImg.src = heatmapDataURL;
    heatmapImg.onload = async () => {
      const contexto = canvas.getContext('2d');
      contexto.clearRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        contexto.drawImage(img, 0, 0, canvas.width, canvas.height);
        contexto.drawImage(heatmapImg, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL();
        try {
          const response = await axios.post('/api/saveHeatmap', { image: dataUrl });
          if (response.status === 200) {
            console.log('Imagem salva com sucesso.');
            setImageExists(true);
          }
        } catch (error) {
          console.error('Erro ao salvar a imagem:', error);
        }
      };
    };
  };

  /**
   * Realiza o download da imagem
   */
  const downloadImage = async () => {
    if (!imageExists) {
      await generateHeatmap();
    }

    const link = document.createElement('a');
    link.href = '/image.png';
    link.download = 'image.png';
    link.click();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NOLEAK 2024 - Mapa de Calor</h1>
      <div ref={heatmapContainerRef} className={styles.heatmapContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={generateHeatmap}>Gerar Heatmap</button>
        <button className={styles.button} onClick={downloadImage}>Baixar Heatmap</button>
      </div>
    </div>
  );
};

export default Heatmap;
