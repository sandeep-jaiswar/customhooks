export default function useHttp(url, options) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setData(null);

        fetch(url, options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response.statusText);
            })
            .then(data => {
                setLoading(false);
                setData(data);
            })
            .catch(error => {
                setLoading(false);
                setError(error);
            });
    }, [url, options]);

    return { loading, error, data };
}