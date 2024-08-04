import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * Substitui o conteudo da imagem para conter os pontos de calor
 * @param req 
 * @param res 
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { image } = req.body;

    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const filePath = path.resolve('./public/image.png');

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        console.error('Erro ao salvar a imagem:', err);
        return res.status(500).json({ error: 'Erro ao salvar a imagem' });
      }
      res.status(200).json({ message: 'Imagem salva com sucesso' });
    });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
