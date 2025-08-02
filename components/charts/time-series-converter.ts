export function convertTimeSeriesData(rawData: any) {

    try {
        const timeSeries = rawData["Weekly Time Series"];

        return Object.entries(timeSeries)
            .map(([timestamp, data]) => ({
                date: timestamp,
                value: parseFloat(data["4. close"])
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-500);
    } catch (error) {
        return [];
    }

}