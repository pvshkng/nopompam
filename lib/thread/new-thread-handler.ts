export function handleNewThread({
    messages,
    _id,
    email,
    setThreads,
}: {
    messages: any;
    _id: any;
    email: any;
    setThreads: React.Dispatch<React.SetStateAction<any[]>>;
}) {
    // @ts-ignore
    const title = messages.annotations?.[0]?.title || "New Chat";
    const newThread = {
        _id: _id,
        user: email,
        title: title,
        timestamp: "Just now",
    };
    setThreads((prevThreads) => [newThread, ...prevThreads]);
    window.history.replaceState(null, "", `/chat?_id=${_id}`);
}