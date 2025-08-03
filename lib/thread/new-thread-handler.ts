import { useParams } from "next/navigation";


export function handleNewThread({
    data,
    _id,
    email,
    setThreads,
    params
}: {
    data: any;
    _id: any;
    email: any;
    setThreads: React.Dispatch<React.SetStateAction<any[]>>;
    params: typeof useParams
}) {
    // @ts-ignore
    const title = data.data?.title! || undefined;
    if (title) {
        const newThread = {
            _id: _id,
            user: email,
            title: title,
            timestamp: Date.now().toString(),
        };
        setThreads((prevThreads) => [newThread, ...prevThreads]);
        if (!params?.slug!) {
            window.history.replaceState(null, "", `/chat/${_id}`);
        }
    } else return

}