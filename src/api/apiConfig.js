const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: '8265bd1679663a7ea12ac168da84d2e8',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
}

export default apiConfig;