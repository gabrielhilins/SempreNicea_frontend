import { createImage } from './utils'

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function cropImage(
  imageSrc: string,
  pixelCrop: PixelCrop,
  options?: { circular?: boolean; fileName?: string; quality?: number }
): Promise<File> {
  // Validação
  if (
    pixelCrop.x < 0 ||
    pixelCrop.y < 0 ||
    pixelCrop.width <= 0 ||
    pixelCrop.height <= 0
  ) {
    throw new Error("Coordenadas de corte inválidas");
  }

  const image = await createImage(imageSrc);
  if (pixelCrop.x + pixelCrop.width > image.width || pixelCrop.y + pixelCrop.height > image.height) {
    throw new Error("Coordenadas de corte excedem as dimensões da imagem");
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Contexto 2D não suportado');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  if (options?.circular) {
    ctx.beginPath();
    ctx.arc(
      pixelCrop.width / 2,
      pixelCrop.height / 2,
      pixelCrop.width / 2,
      0,
      2 * Math.PI
    );
    ctx.clip();
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Falha ao criar blob da imagem'));
          return;
        }
        const file = new File([blob], options?.fileName || 'cropped-image.jpg', {
          type: 'image/jpeg',
        });
        resolve(file);
      },
      'image/jpeg',
      options?.quality || 0.8 // Qualidade padrão de 80%
    );
  });
}


export async function getCroppedProfileImg(
  imageSrc: string,
  pixelCrop: PixelCrop
): Promise<File> {
  return cropImage(imageSrc, pixelCrop, {
    circular: true,
    fileName: 'cropped-profile.jpg',
    quality: 0.8,
  });
}

export async function getCroppedBackgroundImg(
  imageSrc: string,
  pixelCrop: PixelCrop
): Promise<File> {
  return cropImage(imageSrc, pixelCrop, {
    circular: false,
    fileName: 'cropped-background.jpg',
    quality: 0.8,
  });
}


export async function getCropCoordinates(
  pixelCrop: PixelCrop
): Promise<{ cropX: number; cropY: number; cropWidth: number; cropHeight: number }> {
  return {
    cropX: Math.round(pixelCrop.x),
    cropY: Math.round(pixelCrop.y),
    cropWidth: Math.round(pixelCrop.width),
    cropHeight: Math.round(pixelCrop.height),
  };
}
