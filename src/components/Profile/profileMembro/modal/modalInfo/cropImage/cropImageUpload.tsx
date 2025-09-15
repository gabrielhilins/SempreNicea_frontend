import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { Slider } from "@mui/material";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import { getCroppedProfileImg, getCropCoordinates } from "./cropImage";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface CropCoords {
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

// União discriminada para CropImageUploadProps
type CropImageUploadProps =
  | {
      mode: "file";
      imageSrc: string;
      onSave: (file: File) => void;
      onCancel: () => void;
      onRemove: () => void;
      aspectRatio: number;
      cropType: "profile";
    }
  | {
      mode: "coordinates";
      imageSrc: string;
      onSave: (coords: CropCoords) => void;
      onCancel: () => void;
      onRemove: () => void;
      aspectRatio: number;
      cropType: "background";
    };

const CropImageUpload: React.FC<CropImageUploadProps> = ({
  imageSrc,
  onSave,
  onCancel,
  onRemove,
  aspectRatio,
  mode,
  cropType,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImgUrl, setCroppedImgUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const showCroppedImage = async () => {
    if (!croppedAreaPixels) {
      toast.error(t("Selecione uma área para cortar!"));
      return;
    }

    // Validação das coordenadas
    if (
      croppedAreaPixels.x < 0 ||
      croppedAreaPixels.y < 0 ||
      croppedAreaPixels.width <= 0 ||
      croppedAreaPixels.height <= 0
    ) {
      toast.error(t("As coordenadas de corte são inválidas!"));
      return;
    }

    // Validar se as coordenadas estão dentro das dimensões da imagem
    const img = new window.Image();
    img.src = imageSrc;
    await new Promise((resolve) => (img.onload = resolve));
    if (
      croppedAreaPixels.x + croppedAreaPixels.width > img.width ||
      croppedAreaPixels.y + croppedAreaPixels.height > img.height
    ) {
      toast.error(t("As coordenadas de corte excedem as dimensões da imagem!"));
      return;
    }

    try {
      if (mode === "file") {
        const croppedFile = await getCroppedProfileImg(imageSrc, croppedAreaPixels);
        const previewUrl = URL.createObjectURL(croppedFile);
        setCroppedImgUrl(previewUrl);
        onSave(croppedFile);
      } else {
        const coords = await getCropCoordinates(croppedAreaPixels);
        onSave({
          cropX: Math.round(coords.cropX),
          cropY: Math.round(coords.cropY),
          cropWidth: Math.round(coords.cropWidth),
          cropHeight: Math.round(coords.cropHeight),
        });
        toast.success(t("Coordenadas salvas!"));
      }
    } catch (e) {
      console.error("Erro ao processar imagem:", e);
      toast.error(t("Erro ao processar a imagem."));
    }
  };

  return (
    <div className={style.container}>
      {mode === "file" && croppedImgUrl && (
        <div className={style.previewCrop}>
          <h3>{t("Imagem cortada:")}</h3>
          <Image
            src={croppedImgUrl}
            alt={t("Imagem cortada")}
            className={`${style.imgCropped} ${aspectRatio === 1 ? "profile" : "background"}`}
            width={128}
            height={128}
          />
        </div>
      )}

      {imageSrc && (
        <>
          <div className={style.wrapperCrop}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className={style.sliderCrop}>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, z) => setZoom(z as number)}
            />
          </div>

          <div className={style.actions}>
            <button onClick={showCroppedImage} className={style.saveButton}>
              {t("Salvar corte")}
            </button>
            <button onClick={onCancel} className={style.cancelButton}>
              {t("Cancelar")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CropImageUpload;