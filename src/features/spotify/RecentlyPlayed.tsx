import getRecentlyPlayed from "@/actions/spotify/getRecentlyPlayed"

export default async function RecentlyPlayed() {
    const tracks = await getRecentlyPlayed();
    if (!tracks) {
        return <div className="text-red-500">Erro ao buscar músicas recentes</div>
    };

    return (
        <div>
            <ul>
                {tracks.map((track: any) => {
                    return (
                        <li key={track.track.id}>{track.track.name}</li>
                    )
                })}
            </ul>
        </div>
    )
}