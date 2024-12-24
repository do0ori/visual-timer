// RGB로 변환
const hexToRGB = (hex: string): { r: number; g: number; b: number } => {
    const cleanHex = hex.replace('#', '');
    return {
        r: parseInt(cleanHex.substring(0, 2), 16),
        g: parseInt(cleanHex.substring(2, 4), 16),
        b: parseInt(cleanHex.substring(4, 6), 16),
    };
};

// RGB를 HEX로 변환
const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) =>
        Math.max(0, Math.min(255, Math.round(n)))
            .toString(16)
            .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// 상대 휘도(relative luminance) 계산
const getLuminance = (hexColor: string): number => {
    const { r, g, b } = hexToRGB(hexColor);
    const [rs, gs, bs] = [r / 255, g / 255, b / 255];

    const rsRGB = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gsRGB = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bsRGB = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
};

// 명암비(contrast ratio) 계산
const getContrastRatio = (color1: string, color2: string): number => {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
};

// 텍스트 색상 결정
export const getTextColor = (backgroundColor: string): 'white' | 'black' => {
    const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
    const blackContrast = getContrastRatio(backgroundColor, '#000000');
    return whiteContrast > blackContrast ? 'white' : 'black';
};

// 색상 밝기 조절
const adjustBrightness = (color: string, factor: number): string => {
    const { r, g, b } = hexToRGB(color);
    return rgbToHex(r * factor, g * factor, b * factor);
};

type ColorAdjustmentConfig = {
    luminanceThreshold: number; // 휘도 기준점
    darkAdjustment: number; // 어두운 색상 조정 계수
    lightAdjustment: number; // 밝은 색상 조정 계수
};

// 여러 배경색에 대한 텍스트 색상 결정
export const getAdjustedColor = (
    targetColor: string,
    compareColors: string[] = ['#FFFFFF'],
    config: ColorAdjustmentConfig = {
        luminanceThreshold: 0.5,
        darkAdjustment: 0.7,
        lightAdjustment: 0.4,
    }
): string => {
    const primaryLuminance = getLuminance(targetColor);

    // 모든 배경색의 휘도 계산
    const luminances = compareColors.map((color) => getLuminance(color));

    // 주 색상과 각 배경색 간의 휘도 차이 계산
    const luminanceDiffs = luminances.map((lum) => Math.abs(primaryLuminance - lum));

    // 가장 큰 휘도 차이 찾기
    const maxLuminanceDiff = Math.max(...luminanceDiffs);

    // 평균 휘도 차이 계산
    const avgLuminanceDiff = luminanceDiffs.reduce((a, b) => a + b, 0) / luminanceDiffs.length;

    // 휘도 차이에 따른 동적 조정 계수 계산
    const adjustmentFactor = (maxLuminanceDiff + avgLuminanceDiff) / 2;

    if (primaryLuminance < config.luminanceThreshold) {
        // 어두운 색상의 경우
        const adjustment = config.darkAdjustment + adjustmentFactor;
        return adjustBrightness(targetColor, Math.min(2, adjustment));
    } else {
        // 밝은 색상의 경우
        const adjustment = config.lightAdjustment - adjustmentFactor * 0.3;
        return adjustBrightness(targetColor, Math.max(0.2, adjustment));
    }
};
