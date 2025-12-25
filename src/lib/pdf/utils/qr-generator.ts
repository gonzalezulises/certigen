import QRCode from 'qrcode';

export interface QROptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export const generateQRDataURL = async (
  text: string,
  options: QROptions = {}
): Promise<string> => {
  const defaultOptions: QROptions = {
    width: 200,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const dataURL = await QRCode.toDataURL(text, {
      width: mergedOptions.width,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
      errorCorrectionLevel: 'M',
    });
    return dataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const generateValidationURL = (
  baseURL: string,
  certificateNumber: string
): string => {
  return `${baseURL}/validate/${certificateNumber}`;
};
