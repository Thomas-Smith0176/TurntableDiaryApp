import ImageColors from 'react-native-image-colors';

export const getAverageColor = async (uri: string | undefined): Promise<string> => {
    if (!uri) {
        return '#ffffff'; // Default color if no URI provided
    }
    try {
        const result = await ImageColors.getColors(uri, {
        fallback: '#ffffff', // Default if extraction fails
        cache: true,         // Recommended for performance
        key: uri,            // Unique key for caching
        });

        switch (result.platform) {
        case 'android':
            return result.average ?? result.dominant ?? '#ffffff';
        
        case 'ios':
            return result.background;
        
        case 'web':
            return result.lightVibrant ?? '#ffffff';
        
        default:
            return '#ffffff';
        }
    } catch (error) {
        console.error('Failed to extract image color:', error);
        return '#ffffff';
    }
};