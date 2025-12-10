export function usePost(url, body, handleExito, handleError) {
    const { token } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);
    const [exito, setExito] = useState(false);

    useEffect(() => {
        if (url && body) {
            setCargando(true);
            post(url, body, token).then(() => {
                setExito(true);
                setError(false);
                setCargando(false);
                handleExito();
            }).catch(() => {
                setExito(false);
                setError(true);
                setCargando(false);
                handleError()
            })
        }
    }, [token, body, url]);

    return [exito, cargando, error];
}